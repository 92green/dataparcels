// @flow

import type Parcel from '../parcel/Parcel';
import type ParcelId from '../parcelId/ParcelId';

export type ParcelData = {
	value: *,
	child?: *,
	key: string
};

export type ParcelConfig = {
	handleChange: Function,
	value: *
};

export type ParcelConfigInternal = {
	child: *,
	id: ParcelId,
	registry: *,
	parent?: Parcel
};

export type Key = string;

export type Index = number;