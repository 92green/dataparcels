// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';
import ActionCreators from '../../change/ActionCreators';
import prepUpdater from '../../parcelData/prepUpdater';

export default (_this: Parcel): Object => ({

    setIn: (keyPath: Array<Key|Index>, value: *) => {
        Types(`setIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).set(value);
    },

    delete: (key: Key|Index) => {
        Types(`delete()`, `key`, `keyIndex`)(key);
        _this.get(key).delete();
    },

    deleteIn: (keyPath: Array<Key|Index>) => {
        Types(`deleteIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).delete();
    },

    update: (key: Key|Index, updater: ParcelValueUpdater) => {
        Types(`update()`, `key`, `keyIndex`)(key);
        Types(`update()`, `updater`, `function`)(updater);
        _this.get(key).update(updater);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => {
        Types(`updateIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        Types(`updateIn()`, `updater`, `function`)(updater);
        _this.getIn(keyPath).update(updater);
    },

    map: (updater: ParcelValueUpdater) => {
        Types(`map()`, `updater`, `function`)(updater);
        _this.dispatch(ActionCreators.map(prepUpdater(updater)));
    }
});
