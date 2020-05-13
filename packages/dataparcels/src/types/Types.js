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

export type UpdateChangeRequestOnDispatch = (changeRequest: ChangeRequest) => ChangeRequest;

export type ParcelMeta = {[key: string]: *};
export type ParcelMapper = (item: Parcel, property: string|number, parent: Parcel) => *;

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

export type Type = {
    name: string,
    match: (value: any) => boolean,
    properties?: {
        [key: string]: (parcel: Parcel) => any
    },
    childProperties?: {
        [key: string]: (parcel: Parcel) => any
    },
    childPropertiesPrecomputed?: {
        [key: string]: (parcel: Parcel) => any
    },
    internalProperties?: {
        [key: string]: any
    },
    actionHandlers?: {
        [actionType: string]: (parcelData: ParcelData, options: any) => ParcelData
    }
};
