// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';

import Action from './Action';

const deleteSelf: Function = (): Action => {
    return new Action({
        type: "delete"
    });
};

const insertAfter: Function = (key: Key|Index, value: *): Action => {
    return new Action({
        type: "insertAfter",
        keyPath: [key],
        payload: {
            value
        }
    });
};

const insertAfterSelf: Function = (value: *): Action => {
    return new Action({
        type: "insertAfter",
        payload: {
            value
        }
    });
};

const insertBefore: Function = (key: Key|Index, value: *): Action => {
    return new Action({
        type: "insertBefore",
        keyPath: [key],
        payload: {
            value
        }
    });
};

const insertBeforeSelf: Function = (value: *): Action => {
    return new Action({
        type: "insertBefore",
        payload: {
            value
        }
    });
};

const push: Function = (values: Array<*>): Action => {
    return new Action({
        type: "push",
        payload: {
            values
        }
    });
};

const pop: Function = (): Action => {
    return new Action({
        type: "pop"
    });
};

const setData: Function = (parcelData: ParcelData): Action => {
    return new Action({
        type: "setData",
        payload: parcelData
    });
};

const setMeta: Function = (meta: *): Action => {
    return new Action({
        type: "setMeta",
        payload: {
            meta
        }
    });
};

const setSelf: Function = (value: *): Action => {
    return new Action({
        type: "set",
        payload: {
            value
        }
    });
};

const shift: Function = (): Action => {
    return new Action({
        type: "shift"
    });
};

const swap: Function = (keyA: Key|Index, keyB: Key|Index): Action => {
    return new Action({
        type: "swap",
        keyPath: [keyA],
        payload: {
            swapKey: keyB
        }
    });
};

const swapNext: Function = (key: Key|Index): Action => {
    return new Action({
        type: "swapNext",
        keyPath: [key]
    });
};

const swapNextSelf: Function = (): Action => {
    return new Action({
        type: "swapNext"
    });
};

const swapPrev: Function = (key: Key|Index): Action => {
    return new Action({
        type: "swapPrev",
        keyPath: [key]
    });
};

const swapPrevSelf: Function = (): Action => {
    return new Action({
        type: "swapPrev"
    });
};

const swapSelf: Function = (keyB: Key|Index): Action => {
    return new Action({
        type: "swap",
        payload: {
            swapKey: keyB
        }
    });
};

const unshift: Function = (values: Array<*>): Action => {
    return new Action({
        type: "unshift",
        payload: {
            values
        }
    });
};

export default {
    deleteSelf,
    insertAfter,
    insertAfterSelf,
    insertBefore,
    insertBeforeSelf,
    push,
    pop,
    setData,
    setMeta,
    setSelf,
    shift,
    swap,
    swapNext,
    swapNextSelf,
    swapPrev,
    swapPrevSelf,
    swapSelf,
    unshift
};
