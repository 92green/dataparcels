// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import Types from '../../types/Types';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel, dispatch: Function): Object => ({

    insertAfterSelf: (value: *) => {
        dispatch(ActionCreators.insertAfterSelf(value));
    },

    insertBeforeSelf: (value: *) => {
        dispatch(ActionCreators.insertBeforeSelf(value));
    },

    swapNextSelf: () => {
        dispatch(ActionCreators.swapNextSelf());
    },

    swapPrevSelf: () => {
        dispatch(ActionCreators.swapPrevSelf());
    },

    swapSelf: (key: Key|Index) => {
        Types(`swapSelf() expects param "key" to be`, `keyIndex`)(key);
        dispatch(ActionCreators.swapSelf(key));
    }
});
