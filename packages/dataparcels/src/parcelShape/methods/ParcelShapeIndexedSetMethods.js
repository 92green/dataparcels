// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type ParcelShape from '../ParcelShape';

import {insertAfter} from '../../parcelData/parcelData';
import {insertBefore} from '../../parcelData/parcelData';
import {pop} from '../../parcelData/parcelData';
import {push} from '../../parcelData/parcelData';
import {shift} from '../../parcelData/parcelData';
import {unshift} from '../../parcelData/parcelData';

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
