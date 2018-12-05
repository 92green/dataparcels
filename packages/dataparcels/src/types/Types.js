// @flow
import type ParcelId from '../parcelId/ParcelId';
import type Treeshare from '../treeshare/Treeshare';

import Parcel from '../parcel/Parcel';
import Action from '../change/Action';
import ChangeRequest from '../change/ChangeRequest';
import isPlainObject from 'unmutable/lib/util/isPlainObject';

export type ParcelData = {
    value?: *,
    child?: *,
    key?: Key,
    meta?: ParcelMeta
};

export type ParcelDataEvaluator = (parcelData: ParcelData) => ParcelData;

export type ParcelConfig = {
    handleChange?: Function,
    value?: *,
    debugRender?: boolean
};

export type ParcelConfigInternal = {
    onDispatch?: Function,
    child: *,
    meta: ParcelMeta,
    id: ParcelId,
    parent?: ?Parcel,
    treeshare: Treeshare
};

export type CreateParcelConfigType = {
    onDispatch?: Function,
    id?: ParcelId,
    parcelData?: ParcelData,
    parent?: ?Parcel,
    handleChange?: Function,
    treeshare?: Treeshare
};

export type ParcelMeta = {[key: string]: *};
export type ParcelBatcher = (item: Parcel) => void;
export type ParcelMapper = (item: Parcel, index: string|number, _this: Parcel) => *;
export type ParcelUpdater = (item: Parcel) => Parcel;
export type ParcelValueUpdater = (value: *) => *;

export type Key = string;
export type Index = number;
export type Property = number|string;

export type ParcelIdData = {
    id: string[],
    path: string[]
};

const RUNTIME_TYPES = {
    ['array']: {
        name: "an array",
        check: ii => Array.isArray(ii)
    },
    ['boolean']: {
        name: "a boolean",
        check: ii => typeof ii === "boolean"
    },
    ['dispatchable']: {
        name: "an Action, an array of Actions, or a ChangeRequest",
        check: ii => ii instanceof Action
            || (Array.isArray(ii) && ii.every(jj => jj instanceof Action))
            || ii instanceof ChangeRequest
    },
    ['event']: {
        name: "an event",
        check: ii => ii && ii.currentTarget
    },
    ['function']: {
        name: "a function",
        check: ii => typeof ii === "function"
    },
    ['keyIndex']: {
        name: "a key or an index (string or number)",
        check: ii => typeof ii === "string"
            || typeof ii === "number"
    },
    ['keyIndexPath']: {
        name: "an array of keys or indexes (strings or numbers)",
        check: ii => ii
            && Array.isArray(ii)
            && ii.every(jj => typeof jj === "string" || typeof jj === "number")
    },
    ['number']: {
        name: "a number",
        check: ii => typeof ii === "number"
    },
    ['object']: {
        name: "an object",
        check: ii => typeof ii === "object"
    },
    ['parcel']: {
        name: "a Parcel",
        check: ii => ii instanceof Parcel
    },
    ['parcelData']: {
        name: "an object containing parcel data {value: *, meta?: {}, key?: *}",
        check: ii => isPlainObject(ii) && ii.hasOwnProperty('value')
    },
    ['string']: {
        name: "a string",
        check: ii => typeof ii === "string"
    }
};

export default (expecter: string, param: string, type: string|string[]) => (value: any): * => {
    let types = [].concat(type);

    let runtimeTypes = types.map((type: string): * => {
        let runtimeType = RUNTIME_TYPES[type];
        if(!runtimeType) {
            throw new Error(`Unknown type check`);
        }
        return runtimeType;
    });

    let valid = runtimeTypes.some(ii => ii.check(value));

    if(!valid) {
        if(param.indexOf(' ') === -1) {
            param = `param "${param}"`;
        }
        let typeNames = runtimeTypes
            .map(type => type.name)
            .join(", ");

        // $FlowFixMe - I want to make value into a string regardless of flows opinions https://github.com/facebook/flow/issues/1460
        throw new Error(`${expecter} expects ${param} to be ${typeNames}, but got ${(value + "")}`);
    }

    return value;
};
