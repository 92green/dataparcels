// @flow
import Action from './Action';

const del: Function = (key: Key): Action => {
    return new Action({
        type: "delete",
        keyPath: [key]
    });
};

const insert: Function = (key: Key, value: Value): Action => {
    return new Action({
        type: "insert",
        keyPath: [key],
        payload: {
            value
        }
    });
};

const push: Function = (value: Value): Action => {
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

const set: Function = (value: Value): Action => {
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

const swap: Function = (keyA: Key, keyB: Key): Action => {
    return new Action({
        type: "swap",
        keyPath: [keyA],
        payload: {
            swapIndex: keyB
        }
    });
};

const swapNext: Function = (key: Key): Action => {
    return new Action({
        type: "swapNext",
        keyPath: [key]
    });
};

const swapPrev: Function = (key: Key): Action => {
    return new Action({
        type: "swapPrev",
        keyPath: [key]
    });
};

const unshift: Function = (value: Value): Action => {
    return new Action({
        type: "unshift",
        payload: {
            value
        }
    });
};

export default {
    delete: del,
    insert,
    push,
    pop,
    set,
    shift,
    swap,
    swapNext,
    swapPrev,
    unshift
};
