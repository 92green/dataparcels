// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {ParcelMeta} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import Action from './Action';

const deleteSelf = (): Action => {
    return new Action({
        type: "delete"
    });
};

const insertAfterSelf = (value: any): Action => {
    return new Action({
        type: "insertAfter",
        payload: {
            value
        }
    });
};

const insertBeforeSelf = (value: any): Action => {
    return new Action({
        type: "insertBefore",
        payload: {
            value
        }
    });
};

const map = (updater: ParcelValueUpdater): Action => {
    return new Action({
        type: "map",
        payload: {
            updater
        }
    });
};

const move = (keyA: Key|Index, keyB: Key|Index): Action => {
    return new Action({
        type: "move",
        keyPath: [keyA],
        payload: {
            moveKey: keyB
        }
    });
};

const push = (...values: Array<any>): Action => {
    return new Action({
        type: "push",
        payload: {
            values
        }
    });
};

const pop = (): Action => {
    return new Action({
        type: "pop"
    });
};

const setData = (parcelData: ParcelData): Action => {
    return new Action({
        type: "setData",
        payload: parcelData
    });
};

const setMeta = (meta: ParcelMeta): Action => {
    return new Action({
        type: "setMeta",
        payload: {
            meta
        }
    });
};

const setSelf = (value: *): Action => {
    return new Action({
        type: "set",
        payload: {
            value
        }
    });
};

const shift = (): Action => {
    return new Action({
        type: "shift"
    });
};

const swap = (keyA: Key|Index, keyB: Key|Index): Action => {
    return new Action({
        type: "swap",
        keyPath: [keyA],
        payload: {
            swapKey: keyB
        }
    });
};

const swapNextSelf = (): Action => {
    return new Action({
        type: "swapNext"
    });
};

const swapPrevSelf = (): Action => {
    return new Action({
        type: "swapPrev"
    });
};

const unshift = (...values: Array<*>): Action => {
    return new Action({
        type: "unshift",
        payload: {
            values
        }
    });
};

export default {
    deleteSelf,
    insertAfterSelf,
    insertBeforeSelf,
    map,
    move,
    push,
    pop,
    setData,
    setMeta,
    setSelf,
    shift,
    swap,
    swapNextSelf,
    swapPrevSelf,
    unshift
};
