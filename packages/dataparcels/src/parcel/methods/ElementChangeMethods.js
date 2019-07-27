// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import Types from '../../types/Types';

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
    },

    swapSelf: (key: Key|Index) => {
        Types(`swapSelf()`, `key`, `keyIndex`)(key);
        _this.dispatch(ActionCreators.swapSelf(key));
    }
});
