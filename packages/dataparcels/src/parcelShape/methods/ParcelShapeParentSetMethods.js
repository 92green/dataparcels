// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {ParcelShapeValueUpdater} from '../../types/Types';
import type ParcelShape from '../ParcelShape';

import parcelDelete from '../../parcelData/delete';
import parcelSetSelf from '../../parcelData/setSelf';
import parcelUpdateIn from '../../parcelData/updateIn';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

import butLast from 'unmutable/lib/butLast';
import last from 'unmutable/lib/last';

export default (_this: ParcelShape) => ({

    setIn: (keyPath: Array<Key|Index>, value: any): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(keyPath, parcelSetSelf(value))
        );
    },

    deleteIn: (keyPath: Array<Key|Index>): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(
                butLast()(keyPath),
                parcelDelete(last()(keyPath))
            )
        );
    },

    updateIn: (keyPath: Array<Key|Index>, updater: ParcelShapeValueUpdater): ParcelShape => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(
                keyPath,
                (parcelData) => {
                    if(updater._isParcelUpdater) {
                        return updater(parcelData);
                    }
                    let {value} = parcelData;
                    let updatedValue = updater(value);
                    ValidateValueUpdater(value, updatedValue);
                    return parcelSetSelf(updatedValue)(parcelData);
                }
            )
        );
    }
});
