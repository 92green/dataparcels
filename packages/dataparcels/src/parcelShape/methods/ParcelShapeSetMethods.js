// @flow
import type ParcelShape from '../ParcelShape';
import type {ParcelDataEvaluator} from '../../types/Types';
import type {ParcelShapeValueUpdater} from '../../types/Types';
import type {ParcelShapeSetMeta} from '../../types/Types';
import type {ParcelShapeShapeUpdater} from '../../types/Types';

import {ShapeUpdaterNonShapeChildError} from '../../errors/Errors';
import isParentValue from '../../parcelData/isParentValue';
import parcelSetMeta from '../../parcelData/setMeta';
import parcelSetSelf from '../../parcelData/setSelf';
import parcelUpdate from '../../parcelData/update';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

import clear from 'unmutable/lib/clear';
import del from 'unmutable/lib/delete';
import map from 'unmutable/lib/map';
import set from 'unmutable/lib/set';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

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
        let {value} = _this;
        let updatedValue = updater(value, _this);
        ValidateValueUpdater(value, updatedValue);
        return _this.set(updatedValue);
    },

    updateShape: (updater: ParcelShapeShapeUpdater): ParcelShape => {
        let updated: any = updater(_this);
        if(_this._isParcelShape(updated)) {
            return updated;
        }

        if(!isParentValue(updated)) {
            return _this.set(updated);
        }

        return _this._pipeSelf(pipe(
            set('value', clear()(updated)),
            del('child'),
            ...pipeWith(
                updated,
                map((childParcelShape: ParcelShape, key: string|number): ParcelDataEvaluator => {
                    if(!_this._isParcelShape(childParcelShape)) {
                        throw ShapeUpdaterNonShapeChildError();
                    }
                    return parcelUpdate(key, () => childParcelShape.data);
                })
            )
        ));
    }
});
