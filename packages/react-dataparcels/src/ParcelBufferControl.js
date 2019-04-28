// @flow
import type Action from 'dataparcels/Action';

type ParcelBufferControlConfig = {
    release: () => void,
    clear: () => void,
    buffered: boolean,
    actions: Action[]
};

export default class ParcelBufferControl {
    // actions
    release: () => void;
    clear: () => void;

    // status
    buffered: boolean;
    actions: Action[];

    constructor(config: ParcelBufferControlConfig) {
        this.release = config.release;
        this.clear = config.clear;
        this.buffered = config.buffered;
        this.actions = config.actions;
    }
}
