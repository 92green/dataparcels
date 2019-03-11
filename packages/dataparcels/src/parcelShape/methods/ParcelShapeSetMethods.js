// @flow
import type ParcelShape from '../ParcelShape';
import type {ParcelShapeValueUpdater} from '../../types/Types';
import type {ParcelShapeSetMeta} from '../../types/Types';

import parcelSetMeta from '../../parcelData/setMeta';
import parcelSetSelf from '../../parcelData/setSelf';
import shouldDangerouslyUpdateParcelData from '../../parcelData/shouldDangerouslyUpdateParcelData';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

export default (_this: ParcelShape) => ({

    setSelf: (value: *): ParcelShape => {
        return _this._pipeSelf(
            parcelSetSelf(value)
        );
    },

    setMeta: (partialMeta: ParcelShapeSetMeta): ParcelShape => {
        let meta = typeof partialMeta === "function"
            ? partialMeta(_this._parcelData.meta || {})
            : partialMeta;

        return _this._pipeSelf(
            parcelSetMeta(meta)
        );
    },

    update: (updater: ParcelShapeValueUpdater): ParcelShape => {
        if(shouldDangerouslyUpdateParcelData(updater)) {
            return _this._pipeSelf(updater);
        }

        let {value} = _this;
        let updatedValue = updater(value);
        ValidateValueUpdater(value, updatedValue);
        return _this.set(updatedValue);
    }
});
