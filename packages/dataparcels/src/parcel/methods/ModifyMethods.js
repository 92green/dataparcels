// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type Parcel from '../Parcel';
import type {ParcelData} from '../../types/Types';
import type {ParcelDataEvaluator} from '../../types/Types';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';

import {checkCancellation} from '../../change/CancelActionMarker';
import Types from '../../types/Types';
import prepUpdater from '../../parcelData/prepUpdater';
import setMetaDefault from '../../parcelData/setMetaDefault';

import HashString from '../../util/HashString';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import pipeWith from 'unmutable/lib/util/pipeWith';

let HashFunction = (fn: Function): string => `${HashString(fn.toString())}`;

export default (_this: Parcel): Object => ({

    _pushModifierId: (prefix: string, updater: Function): string => {
        let id = updater._updateRaw
            ? `s${HashFunction(updater._updater || updater)}`
            : HashFunction(updater);

        return _this._id.pushModifier(`${prefix}-${id}`);
    },

    modifyDown: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyDown()`, `updater`, `function`)(updater);
        let parcelDataUpdater: ParcelDataEvaluator = prepUpdater(updater);
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
            let nextData = prepUpdater(updater)(parcelData, changeRequest);
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
