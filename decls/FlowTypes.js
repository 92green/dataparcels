// @flow

type ParcelType = Parcel | ListParcel;

type Keys = {
    key?: number,
    children?: *
};

type ParcelData = {
    value: *,
    meta: Object,
    keys?: Keys
};


type Action = {
    type: string,
    payload: Object
};

type HandleChange = (newData: *, action: Action) => {};
type valueUpdater = (value: *) => *;
type OnChangeUpdater = (newValue: *) => *;
type Mapper = (parcel: Parcel, key: string|number) => *;
