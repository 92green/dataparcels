// @flow
import type Parcel from 'dataparcels';
import type Action from 'dataparcels/Action';

type ParcelBufferControlConfig = {
    submit: () => void,
    reset: () => void,
    buffered: boolean,
    actions: Action[],
    _outerParcel: Parcel
};

export default class ParcelBufferControl {
    // actions
    submit: () => void;
    reset: () => void;

    // status
    buffered: boolean;
    actions: Action[];

    // parcel
    _outerParcel: Parcel;

    constructor(config: ParcelBufferControlConfig) {
        this.submit = config.submit;
        this.reset = config.reset;
        this.buffered = config.buffered;
        this.actions = config.actions;
        this._outerParcel = config._outerParcel;
    }
}
