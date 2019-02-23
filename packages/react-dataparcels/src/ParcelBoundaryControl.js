// @flow
import type Action from 'dataparcels/Action';

type ParcelBoundaryControlConfig = {
    release: () => void,
    cancel: () => void,
    buffered: boolean,
    buffer: Action[]
};

export default class ParcelBoundaryControl {
    // actions
    release: () => void;
    cancel: () => void;

    // status
    buffered: boolean;
    buffer: Action[];

    constructor(config: ParcelBoundaryControlConfig) {
        this.release = config.release;
        this.cancel = config.cancel;
        this.buffered = config.buffered;
        this.buffer = config.buffer;
    }
}
