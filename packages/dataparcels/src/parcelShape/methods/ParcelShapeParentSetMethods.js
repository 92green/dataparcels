// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {ParcelShapeValueUpdater} from '../../types/Types';
import type ParcelShape from '../ParcelShape';

import {del as parcelDelete} from '../../parcelData/parcelData';
import {setSelf as parcelSetSelf} from '../../parcelData/parcelData';
import {map as parcelMap} from '../../parcelData/parcelData';
import prepUpdater from '../../parcelData/prepUpdater';
import parcelUpdate from '../../parcelData/update';

export default (_this: ParcelShape) => ({

    set: (key: Key|Index, value: any): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdate(key, parcelSetSelf(value))
        );
    },

    delete: (key: Key|Index): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelDelete(key)
        );
    },

    update: (key: Key|Index, updater: ParcelShapeValueUpdater): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdate(key, prepUpdater(updater))
        );
    },

    map: (updater: ParcelShapeValueUpdater): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelMap(prepUpdater(updater))
        );
    }
});
