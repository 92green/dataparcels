// @flow
import Types from '../types/Types';
import type {Index, Key} from '../types/Types';

import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import ActionCreators from '../change/ActionCreators';

export default MethodCreator("Indexed", (_this: Parcel, dispatch: Function): Object => ({

    // change methods

    delete: (key: Key|Index) => {
        Types(`delete() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.delete(key));
    },

    insertAfter: (key: Key|Index, value: *) => {
        Types(`insertAfter() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.insertAfter(key, value));
    },

    insertBefore: (key: Key|Index, value: *) => {
        Types(`insertBefore() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.insertBefore(key, value));
    },

    push: (value: *) => {
        dispatch(ActionCreators.push(value));
    },

    pop: () => {
        dispatch(ActionCreators.pop());
    },

    shift: () => {
        dispatch(ActionCreators.shift());
    },

    swap: (keyA: Key|Index, keyB: Key|Index) => {
        Types(`swap() expects param "keyA" to be`, `keyIndex`)(keyA);
        Types(`swap() expects param "keyB" to be`, `keyIndex`)(keyB);
        dispatch(ActionCreators.swap(keyA, keyB));
    },

    swapNext: (key: Key|Index) => {
        Types(`swapNext() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.swapNext(key));
    },

    swapPrev: (key: Key|Index) => {
        Types(`swapPrev() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.swapPrev(key));
    },

    unshift: (value: *) => {
        dispatch(ActionCreators.unshift(value));
    }
}));
