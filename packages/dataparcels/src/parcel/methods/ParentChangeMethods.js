// @flow
import type Parcel from '../Parcel';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';
import ActionCreators from '../../change/ActionCreators';
import prepUpdater from '../../parcelData/prepUpdater';

export default (_this: Parcel): Object => ({
    map: (updater: ParcelValueUpdater) => {
        Types(`map()`, `updater`, `function`)(updater);
        _this.dispatch(ActionCreators.map(prepUpdater(updater)));
    }
});
