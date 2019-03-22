// @flow
import type Action from 'dataparcels/Action';
import type Parcel from 'dataparcels';

type ParcelBoundaryControlConfig = {
    release: () => void,
    cancel: () => void,
    buffered: boolean,
    buffer: Action[],
    originalParcel: Parcel
};

export default class ParcelBoundaryControl {
    // actions
    release: () => void;
    cancel: () => void;

    // status
    buffered: boolean;
    buffer: Action[];

    // data
    originalParcel: Parcel;

    constructor(config: ParcelBoundaryControlConfig) {
        this.release = config.release;
        this.cancel = config.cancel;
        this.buffered = config.buffered;
        this.buffer = config.buffer;
        this.originalParcel = config.originalParcel;
    }
}
