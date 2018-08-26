// @flow
import type {Index, Key} from '../types/Types';
import Types from '../types/Types';

import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';

export default MethodCreator("Parent", (_this: Parcel /*, dispatch: Function*/): Object => ({
    set: (key: Key|Index, value: *) => {
        Types(`set() expects param "key" to be`, `keyIndex`)(key);
        _this.get(key).setSelf(value);
    },

    update: (key: Key|Index, updater: Function) => {
        Types(`update() expects param "key" to be`, `keyIndex`)(key);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.get(key).updateSelf(updater);
    },

    setIn: (keyPath: Array<Key|Index>, value: *) => {
        Types(`setIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).setSelf(value);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: Function) => {
        Types(`updateIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.getIn(keyPath).updateSelf(updater);
    }
}));
