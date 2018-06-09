// @flow
import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import ActionCreators from '../change/ActionCreators';

export default MethodCreator("Child", (_this: Parcel): Object => ({

    // change methods

    deleteSelf: () => {
        _this.dispatch(ActionCreators.deleteSelf());
    }
}));
