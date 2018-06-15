// @flow
import Types from '../types/Types';
import type {Key, Index} from '../types/Types';

import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import ActionCreators from '../change/ActionCreators';

export default MethodCreator("Element", (_this: Parcel): Object => ({
    // change methods

    insertAfterSelf: (value: *) => {
        _this.dispatch(ActionCreators.insertAfterSelf(value));
    },

    insertBeforeSelf: (value: *) => {
        _this.dispatch(ActionCreators.insertBeforeSelf(value));
    },

    swapNextWithSelf: () => {
        _this.dispatch(ActionCreators.swapNextWithSelf());
    },

    swapPrevWithSelf: () => {
        _this.dispatch(ActionCreators.swapPrevWithSelf());
    },

    swapWithSelf: (key: Key|Index) => {
        Types(`swapWithSelf() expects param "key" to be`, `keyIndex`)(key);
        _this.dispatch(ActionCreators.swapWithSelf(key));
    }
}));
