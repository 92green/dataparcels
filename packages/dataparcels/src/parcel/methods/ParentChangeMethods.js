// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelValueUpdater} from '../../types/Types';
import type {StaticParcelUpdater} from '../../types/Types';

import Types from '../../types/Types';

export default (_this: Parcel /*, dispatch: Function*/): Object => ({
    set: (key: Key|Index, value: *) => {
        Types(`set()`, `key`, `keyIndex`)(key);
        _this.get(key).set(value);
    },

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

    updateDeep: (key: Key|Index, updater: StaticParcelUpdater) => {
        Types(`update()`, `key`, `keyIndex`)(key);
        Types(`update()`, `updater`, `function`)(updater);
        _this.get(key).updateDeep(updater);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: ParcelValueUpdater) => {
        Types(`updateIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        Types(`updateIn()`, `updater`, `function`)(updater);
        _this.getIn(keyPath).update(updater);
    },

    updateInDeep: (keyPath: Array<Key|Index>, updater: StaticParcelUpdater) => {
        Types(`updateInDeep()`, `keyPath`, `keyIndexPath`)(keyPath);
        Types(`updateInDeep()`, `updater`, `function`)(updater);
        _this.getIn(keyPath).updateDeep(updater);
    }
});
