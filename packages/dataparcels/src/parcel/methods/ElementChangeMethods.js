// @flow
import Types from '../../types/Types';
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';

import type Parcel from '../Parcel';
import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel, dispatch: Function): Object => ({

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
});
