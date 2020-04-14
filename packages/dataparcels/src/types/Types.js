// @flow
import type Parcel from '../parcel/Parcel';
import type ChangeRequest from '../change/ChangeRequest';

export type ParcelData = {
    value?: *,
    child?: *,
    key?: Key,
    meta?: ParcelMeta
};

export type ParcelDataEvaluator = (parcelData: ParcelData) => ParcelData;

export type ParcelConfig = {
    handleChange?: Function,
    value?: *
};

export type ParcelParent = {
    isIndexed: boolean,
    isFirstChild: boolean,
    isLastChild: boolean
};

export type ParcelConfigInternal = {
    child: *,
    dispatchId: string,
    rawId: string[],
    rawPath: string[],
    frameMeta: {[key: string]: any},
    meta: ParcelMeta,
    parent: ParcelParent,
    treeShare: ParcelTreeShare,
    updateChangeRequestOnDispatch: UpdateChangeRequestOnDispatch
};

export type ParcelCreateConfigType = {
    dispatchId?: string,
    frameMeta?: {[key: string]: any},
    rawId?: string[],
    rawPath?: string[],
    handleChange?: Function,
    parcelData?: ParcelData,
    parent?: ParcelParent,
    treeShare?: ParcelTreeShare,
    updateChangeRequestOnDispatch?: UpdateChangeRequestOnDispatch
};

export type UpdateChangeRequestOnDispatch = (changeRequest: ChangeRequest) => ChangeRequest;

export type ParcelMeta = {[key: string]: *};
export type ParcelMapper = (item: Parcel, property: string|number, parent: Parcel) => *;
export type ParcelTreeShare = {
    registry: {[id: string]: Parcel},
    effectRegistry: {[effectId: string]: boolean}
};

export type ParcelUpdater = (item: Parcel) => Parcel;
export type ParcelValueUpdater = Function;

export type Key = string;
export type Index = number;
export type Property = number|string;

export type ActionStep = {
    type: string,
    key?: Key|Index,
    updater?: ParcelDataEvaluator,
    changeRequest?: ChangeRequest,
    effectParcel?: Parcel
};

export type ParentType = any; // should be any parent data type

export type ContinueChainFunction = (continueChain: () => void, changeRequest: ?ChangeRequest) => void;
