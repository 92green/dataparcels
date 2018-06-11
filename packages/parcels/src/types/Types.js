// @flow

import type Parcel from '../parcel/Parcel';
import type ParcelId from '../parcelId/ParcelId';
import type Modifiers from '../modifiers/Modifiers';
import type Treeshare from '../treeshare/Treeshare';

export type ParcelData = {
    value: *,
    child: *,
    key: string,
    meta: Object
};

export type PartialParcelData = {
    value?: *,
    child?: *,
    key?: string,
    meta?: Object
};

export type ParcelConfig = {
    handleChange?: Function,
    value?: *,
    debugRender?: boolean
};

export type ParcelConfigInternal = {
    onDispatch?: Function,
    child: *,
    meta: Object,
    id: ParcelId,
    modifiers?: Modifiers,
    parent?: Parcel,
    treeshare: Treeshare
};

export type CreateParcelConfigType = {
    onDispatch?: Function,
    id: ParcelId,
    parcelData: ParcelData,
    parent?: Parcel
};

export type ModifierFunction = Function;

export type ModifierObject = {
    match?: string,
    modifier: ModifierFunction
};

export type Key = string;

export type Index = number;
