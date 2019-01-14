// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type StaticParcel from '../StaticParcel';

import insertAfter from '../../parcelData/insertAfter';
import insertBefore from '../../parcelData/insertBefore';
import pop from '../../parcelData/pop';
import push from '../../parcelData/push';
import shift from '../../parcelData/shift';
import swap from '../../parcelData/swap';
import swapNext from '../../parcelData/swapNext';
import swapPrev from '../../parcelData/swapPrev';
import unshift from '../../parcelData/unshift';

export default (_this: StaticParcel) => ({

    insertAfter: (key: Key|Index, value: *): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            insertAfter(key, value)
        );
    },

    insertBefore: (key: Key|Index, value: *): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            insertBefore(key, value)
        );
    },

    pop: (): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            pop()
        );
    },

    push: (value: *): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            push(value)
        );
    },

    shift: (): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            shift()
        );
    },

    swap: (keyA: Key|Index, keyB: Key|Index): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            swap(keyA, keyB)
        );
    },

    swapNext: (key: Key|Index): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            swapNext(key)
        );
    },

    swapPrev: (key: Key|Index): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            swapPrev(key)
        );
    },

    unshift: (value: *): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            unshift(value)
        );
    }
});
