// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';

export default (_this: Parcel /*, dispatch: Function*/): Object => ({
    set: (key: Key|Index, value: *) => {
        Types(`set()`, `key`, `keyIndex`)(key);
        _this.get(key).set(value);
    },

    update: (key: Key|Index, updater: ParcelValueUpdater) => {
        Types(`update()`, `key`, `keyIndex`)(key);
        Types(`update()`, `updater`, `function`)(updater);
        _this.get(key).update(updater);
    },

    setIn: (keyPath: Array<Key|Index>, value: *) => {
        Types(`setIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).set(value);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => {
        Types(`updateIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        Types(`update()`, `updater`, `function`)(updater);
        _this.getIn(keyPath).update(updater);
    },

    deleteIn: (keyPath: Array<Key|Index>) => {
        Types(`deleteIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).delete();
    }
});
