// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';

export default (_this: Parcel /*, dispatch: Function*/): Object => ({
    set: (key: Key|Index, value: *) => {
        Types(`set() expects param "key" to be`, `keyIndex`)(key);
        _this.get(key).setSelf(value);
    },

    update: (key: Key|Index, updater: ParcelValueUpdater) => {
        Types(`update() expects param "key" to be`, `keyIndex`)(key);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.get(key).updateSelf(updater);
    },

    setIn: (keyPath: Array<Key|Index>, value: *) => {
        Types(`setIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).setSelf(value);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => {
        Types(`updateIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.getIn(keyPath).updateSelf(updater);
    }
});
