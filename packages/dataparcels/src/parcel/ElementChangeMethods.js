// @flow
import Types from '../types/Types';
import type {Key, Index} from '../types/Types';

import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import ActionCreators from '../change/ActionCreators';

export default MethodCreator("Element", (_this: Parcel, dispatch: Function): Object => ({
    // change methods

    insertAfterSelf: (value: *) => {
        dispatch(ActionCreators.insertAfterSelf(value));
    },

    insertBeforeSelf: (value: *) => {
        dispatch(ActionCreators.insertBeforeSelf(value));
    },

    swapNextWithSelf: () => {
        dispatch(ActionCreators.swapNextWithSelf());
    },

    swapPrevWithSelf: () => {
        dispatch(ActionCreators.swapPrevWithSelf());
    },

    swapWithSelf: (key: Key|Index) => {
        Types(`swapWithSelf() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.swapWithSelf(key));
    }
}));
