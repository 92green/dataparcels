// @flow
import type StaticParcel from '../StaticParcel';
import type {ParcelDataEvaluator} from '../../types/Types';
import type {StaticParcelValueUpdater} from '../../types/Types';
import type {StaticParcelSetMeta} from '../../types/Types';
import type {StaticParcelUpdater} from '../../types/Types';

import {DeepUpdaterNonStaticChildError} from '../../errors/Errors';
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

export default (_this: StaticParcel) => ({

    setSelf: (value: *): StaticParcel => {
        return _this._pipeSelf(
            parcelSetSelf(value)
        );
    },

    setMeta: (partialMeta: StaticParcelSetMeta): StaticParcel => {
        let meta = typeof partialMeta === "function"
            ? partialMeta(_this._parcelData.meta || {})
            : partialMeta;

        return _this._pipeSelf(
            parcelSetMeta(meta)
        );
    },

    update: (updater: StaticParcelValueUpdater): StaticParcel => {
        let {value} = _this;
        let updatedValue = updater(value, _this);
        ValidateValueUpdater(value, updatedValue);
        return _this.set(updatedValue);
    },

    updateDeep: (updater: StaticParcelUpdater): StaticParcel => {
        let updated: any = updater(_this);
        if(_this._isStaticParcel(updated)) {
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
                map((childStaticParcel: StaticParcel, key: string|number): ParcelDataEvaluator => {
                    if(!_this._isStaticParcel(childStaticParcel)) {
                        throw DeepUpdaterNonStaticChildError();
                    }
                    return parcelUpdate(key, () => childStaticParcel.data);
                })
            )
        ));
    }
});
