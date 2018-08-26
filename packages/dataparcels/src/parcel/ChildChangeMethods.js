// @flow
import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import ActionCreators from '../change/ActionCreators';

export default MethodCreator("Child", (_this: Parcel, dispatch: Function): Object => ({

    // change methods

    deleteSelf: () => {
        dispatch(ActionCreators.deleteSelf());
    }
}));
