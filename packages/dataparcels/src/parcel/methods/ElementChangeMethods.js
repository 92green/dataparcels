// @flow
import type Parcel from '../Parcel';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel): Object => ({

    insertAfterSelf: (value: *) => {
        _this.dispatch(ActionCreators.insertAfterSelf(value));
    },

    insertBeforeSelf: (value: *) => {
        _this.dispatch(ActionCreators.insertBeforeSelf(value));
    },

    swapNextSelf: () => {
        _this.dispatch(ActionCreators.swapNextSelf());
    },

    swapPrevSelf: () => {
        _this.dispatch(ActionCreators.swapPrevSelf());
    }
});
