// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import Types from '../../types/Types';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel): Object => ({

    move: (keyA: Key|Index, keyB: Key|Index) => {
        Types(`move()`, `keyA`, `keyIndex`)(keyA);
        Types(`move()`, `keyB`, `keyIndex`)(keyB);
        _this.dispatch(ActionCreators.move(keyA, keyB));
    },

    push: (...values: Array<*>) => {
        _this.dispatch(ActionCreators.push(values));
    },

    pop: () => {
        _this.dispatch(ActionCreators.pop());
    },

    shift: () => {
        _this.dispatch(ActionCreators.shift());
    },

    swap: (keyA: Key|Index, keyB: Key|Index) => {
        Types(`swap()`, `keyA`, `keyIndex`)(keyA);
        Types(`swap()`, `keyB`, `keyIndex`)(keyB);
        _this.dispatch(ActionCreators.swap(keyA, keyB));
    },

    swapNext: (key: Key|Index) => {
        Types(`swapNext()`, `key`, `keyIndex`)(key);
        _this.dispatch(ActionCreators.swapNext(key));
    },

    swapPrev: (key: Key|Index) => {
        Types(`swapPrev()`, `key`, `keyIndex`)(key);
        _this.dispatch(ActionCreators.swapPrev(key));
    },

    unshift: (...values: Array<*>) => {
        _this.dispatch(ActionCreators.unshift(values));
    }
});
