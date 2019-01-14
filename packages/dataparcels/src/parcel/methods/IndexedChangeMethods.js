// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import Types from '../../types/Types';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel, dispatch: Function): Object => ({

    insertAfter: (key: Key|Index, value: *) => {
        Types(`insertAfter()`, `key`, `keyIndex`)(key);
        dispatch(ActionCreators.insertAfter(key, value));
    },

    insertBefore: (key: Key|Index, value: *) => {
        Types(`insertBefore()`, `key`, `keyIndex`)(key);
        dispatch(ActionCreators.insertBefore(key, value));
    },

    push: (...values: Array<*>) => {
        dispatch(ActionCreators.push(values));
    },

    pop: () => {
        dispatch(ActionCreators.pop());
    },

    shift: () => {
        dispatch(ActionCreators.shift());
    },

    swap: (keyA: Key|Index, keyB: Key|Index) => {
        Types(`swap()`, `keyA`, `keyIndex`)(keyA);
        Types(`swap()`, `keyB`, `keyIndex`)(keyB);
        dispatch(ActionCreators.swap(keyA, keyB));
    },

    swapNext: (key: Key|Index) => {
        Types(`swapNext()`, `key`, `keyIndex`)(key);
        dispatch(ActionCreators.swapNext(key));
    },

    swapPrev: (key: Key|Index) => {
        Types(`swapPrev()`, `key`, `keyIndex`)(key);
        dispatch(ActionCreators.swapPrev(key));
    },

    unshift: (...values: Array<*>) => {
        dispatch(ActionCreators.unshift(values));
    }
});
