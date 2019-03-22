// @flow
import type Parcel from '../Parcel';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel): Object => ({

    deleteSelf: () => {
        _this.dispatch(ActionCreators.deleteSelf());
    }
});
