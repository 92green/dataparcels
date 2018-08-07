// @flow
import type {
    Key,
    Index
} from '../types/Types';
import Action from './Action';

const del: Function = (key: Key|Index): Action => {
    return new Action({
        type: "delete",
        keyPath: [key]
    });
};

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

const ping: Function = (): Action => {
    return new Action({
        type: "ping"
    });
};

const push: Function = (value: *): Action => {
    return new Action({
        type: "push",
        payload: {
            value
        }
    });
};

const pop: Function = (): Action => {
    return new Action({
        type: "pop"
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

const swapNextWithSelf: Function = (): Action => {
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

const swapPrevWithSelf: Function = (): Action => {
    return new Action({
        type: "swapPrev"
    });
};

const swapWithSelf: Function = (keyB: Key|Index): Action => {
    return new Action({
        type: "swap",
        payload: {
            swapKey: keyB
        }
    });
};

const unshift: Function = (value: *): Action => {
    return new Action({
        type: "unshift",
        payload: {
            value
        }
    });
};

export default {
    delete: del,
    deleteSelf,
    insertAfter,
    insertAfterSelf,
    insertBefore,
    insertBeforeSelf,
    ping,
    push,
    pop,
    setMeta,
    setSelf,
    shift,
    swap,
    swapNext,
    swapNextWithSelf,
    swapPrev,
    swapPrevWithSelf,
    swapWithSelf,
    unshift
};
