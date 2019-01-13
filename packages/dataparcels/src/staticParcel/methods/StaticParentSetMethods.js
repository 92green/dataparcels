// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {StaticParcelUpdater} from '../../types/Types';
import type {StaticParcelValueUpdater} from '../../types/Types';
import type StaticParcel from '../StaticParcel';

import parcelDelete from '../../parcelData/delete';
import parcelSetSelf from '../../parcelData/setSelf';
import parcelUpdateIn from '../../parcelData/updateIn';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

import butLast from 'unmutable/lib/butLast';
import last from 'unmutable/lib/last';

export default (_this: StaticParcel) => ({

    setIn: (keyPath: Array<Key|Index>, value: any): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(keyPath, parcelSetSelf(value))
        );
    },

    deleteIn: (keyPath: Array<Key|Index>): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(
                butLast()(keyPath),
                parcelDelete(last()(keyPath))
            )
        );
    },

    updateIn: (keyPath: Array<Key|Index>, updater: StaticParcelValueUpdater): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(
                keyPath,
                (parcelData) => {
                    let {value} = parcelData;
                    let updatedValue = updater(value, _this);
                    ValidateValueUpdater(value, updatedValue);
                    return parcelSetSelf(updatedValue)(parcelData);
                }
            )
        );
    },

    updateInDeep: (keyPath: Array<Key|Index>, updater: StaticParcelUpdater): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelUpdateIn(
                keyPath,
                (parcelData) => _this._instanceUpdateFromData(updater)(parcelData)
            )
        );
    }
});
