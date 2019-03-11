// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../Parcel';
import type {ParcelData} from '../../types/Types';
import type {ParcelDataEvaluator} from '../../types/Types';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';

import {checkCancellation} from '../../change/CancelActionMarker';
import Types from '../../types/Types';
import setSelf from '../../parcelData/setSelf';
import setMetaDefault from '../../parcelData/setMetaDefault';
import shouldDangerouslyUpdateParcelData from '../../parcelData/shouldDangerouslyUpdateParcelData';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

import HashString from '../../util/HashString';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import pipeWith from 'unmutable/lib/util/pipeWith';

let HashFunction = (fn: Function): string => `${HashString(fn.toString())}`;

let getModifierUpdater = (updater: ParcelValueUpdater): Function => {
    return shouldDangerouslyUpdateParcelData(updater)
        ? updater
        : (parcelData: ParcelData, changeRequest: ChangeRequest): ParcelData => {
            let {value} = parcelData;
            let updatedValue = updater(value, changeRequest);
            ValidateValueUpdater(value, updatedValue);
            return setSelf(updatedValue)(parcelData);
        };
};

export default (_this: Parcel): Object => ({

    _pushModifierId: (prefix: string, updater: Function): string => {
        let id = shouldDangerouslyUpdateParcelData(updater)
            ? `s${HashFunction(updater._updater || updater)}`
            : HashFunction(updater);

        return _this._id.pushModifier(`${prefix}-${id}`);
    },

    modifyDown: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyDown()`, `updater`, `function`)(updater);
        let parcelDataUpdater: ParcelDataEvaluator = getModifierUpdater(updater);
        return _this._create({
            id: _this._methods._pushModifierId('md', updater),
            parcelData: parcelDataUpdater(_this._parcelData),
            updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                type: 'md',
                updater: parcelDataUpdater
            })
        });
    },

    modifyUp: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyUp()`, `updater`, `function`)(updater);
        let parcelDataUpdater = (parcelData: ParcelData, changeRequest: ChangeRequest): ParcelData => {
            let nextData = getModifierUpdater(updater)(parcelData, changeRequest);
            return checkCancellation(nextData);
        };

        return _this._create({
            id: _this._methods._pushModifierId('mu', updater),
            updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                type: 'mu',
                updater: parcelDataUpdater,
                changeRequest
            })
        });
    },

    initialMeta: (initialMeta: ParcelMeta): Parcel => {
        Types(`initialMeta()`, `initialMeta`, `object`)(initialMeta);
        let {meta} = _this._parcelData;

        let parcelDataUpdater = pipeWith(
            initialMeta,
            filterNot((value, key) => has(key)(meta)),
            setMetaDefault
        );

        return _this._create({
            id: _this._id.pushModifier('im'),
            parcelData: parcelDataUpdater(_this._parcelData),
            updateChangeRequestOnDispatch: (changeRequest) => changeRequest._addStep({
                type: 'mu',
                updater: parcelDataUpdater,
                changeRequest
            })
        });
    }
});
