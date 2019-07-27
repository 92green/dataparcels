// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type ParcelShape from '../ParcelShape';

import insertAfter from '../../parcelData/insertAfter';
import insertBefore from '../../parcelData/insertBefore';
import pop from '../../parcelData/pop';
import push from '../../parcelData/push';
import shift from '../../parcelData/shift';
import unshift from '../../parcelData/unshift';

export default (_this: ParcelShape) => ({

    insertAfter: (key: Key|Index, value: *): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            insertAfter(key, value)
        );
    },

    insertBefore: (key: Key|Index, value: *): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            insertBefore(key, value)
        );
    },

    pop: (): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            pop()
        );
    },

    push: (...values: Array<*>): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            push(...values)
        );
    },

    shift: (): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            shift()
        );
    },

    unshift: (...values: Array<*>): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            unshift(...values)
        );
    }
});
