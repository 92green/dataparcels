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

const insert: Function = (key: Key|Index, value: *): Action => {
    return new Action({
        type: "insert",
        keyPath: [key],
        payload: {
            value
        }
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
            swapIndex: keyB
        }
    });
};

const swapNext: Function = (key: Key|Index): Action => {
    return new Action({
        type: "swapNext",
        keyPath: [key]
    });
};

const swapPrev: Function = (key: Key|Index): Action => {
    return new Action({
        type: "swapPrev",
        keyPath: [key]
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
    insert,
    push,
    pop,
    setSelf,
    shift,
    swap,
    swapNext,
    swapPrev,
    unshift
};
