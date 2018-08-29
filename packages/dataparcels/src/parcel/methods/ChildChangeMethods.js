// @flow
import type Parcel from '../Parcel';

import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel, dispatch: Function): Object => ({

    deleteSelf: () => {
        dispatch(ActionCreators.deleteSelf());
    }
});
