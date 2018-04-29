// @flow

import type Parcel from '../parcel/Parcel';
import type ParcelId from '../parcelId/ParcelId';
import type Treeshare from '../treeshare/Treeshare';

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
	treeshare: Treeshare,
	parent?: Parcel
};

export type Key = string;

export type Index = number;