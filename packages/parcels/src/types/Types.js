// @flow

import type Parcel from '../parcel/Parcel';
import type ParcelId from '../parcelId/ParcelId';
import type Modifiers from '../modifiers/Modifiers';
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
	modifiers?: Modifiers,
	parent?: Parcel,
	treeshare: Treeshare
};

export type Key = string;

export type Index = number;