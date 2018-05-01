// @flow
import type {Key} from '../types/Types';

import last from 'unmutable/lib/last';
import join from 'unmutable/lib/join';
import push from 'unmutable/lib/push';
import rest from 'unmutable/lib/rest';
import update from 'unmutable/lib/update';
import updateIn from 'unmutable/lib/updateIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

type ParcelIdData = {
    id: string[],
    path: string[],
    typedPath: string[]
};

const DEFAULT_PARCELID_DATA = {
    id: ["^"],
    path: ["^"],
    typedPath: ["^"]
};

export default class ParcelId {
    _id: string[];
    _path: string[];
    _typedPath: string[];

    constructor(parcelIdData: ParcelIdData = DEFAULT_PARCELID_DATA) {
        this._id = parcelIdData.id;
        this._path = parcelIdData.path;
        this._typedPath = parcelIdData.typedPath;
    }

    _create: Function = (data: Object): ParcelId => {
        return new ParcelId(data);
    };

    key: Function = (): Key => {
        return last()(this._path);
    };

    id: Function = (): string => {
        if(this._id.length === 1) {
            return this._id[0];
        }
        return pipeWith(
            this._id,
            rest(),
            join("/")
        );
    };

    path: Function = (): Array<Key> => {
        return pipeWith(
            this._path,
            rest()
        );
    };

    typedPathString: Function = (): string => {
        if(this._typedPath.length === 1) {
            return this._typedPath[0];
        }
        return pipeWith(
            this._typedPath,
            rest(),
            join("/")
        );
    };

    push: Function = (key: Key, isElement: boolean): ParcelId => {
        let encodePush: Function = isElement
            ? push(key)
            : push(encodeURIComponent(`${key}`));

        return pipeWith(
            this.toJS(),
            update('id', encodePush),
            update('path', push(key)),
            update('typedPath', encodePush),
            this._create
        );
    };

    pushModifier: Function = (modifierTypeId: string): ParcelId => {
        return pipeWith(
            this.toJS(),
            update('id', push(`~${modifierTypeId}`)),
            this._create
        );
    };

    toJS: Function = (): Object => ({
        id: this._id,
        path: this._path,
        typedPath: this._typedPath
    });

    setTypeCode: Function = (typeCode: string): ParcelId => {
        return pipeWith(
            this.toJS(),
            updateIn(['typedPath', -1], ii => `${ii}:${typeCode}`),
            this._create
        );
    };
}
