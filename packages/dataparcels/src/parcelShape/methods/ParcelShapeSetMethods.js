// @flow
import type ParcelShape from '../ParcelShape';
import type {ParcelShapeValueUpdater} from '../../types/Types';
import type {ParcelShapeSetMeta} from '../../types/Types';

import prepUpdater from '../../parcelData/prepUpdater';
import {setMeta as parcelSetMeta} from '../../parcelData/parcelData';
import {setSelf as parcelSetSelf} from '../../parcelData/parcelData';

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

    updateSelf: (updater: ParcelShapeValueUpdater): ParcelShape => {
        return _this._pipeSelf(prepUpdater(updater));
    }
});
