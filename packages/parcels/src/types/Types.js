// @flow

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
	child?: *,
	id: string,
	key: string,
	registry?: *
};

export type Key = string;

export type Index = number;