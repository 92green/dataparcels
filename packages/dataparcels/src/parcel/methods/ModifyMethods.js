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
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

import HashString from '../../util/HashString';

import filterNot from 'unmutable/lib/filterNot';
import has from 'unmutable/lib/has';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

let HashFunction = (fn: Function): string => `${HashString(fn.toString())}`;

export default (_this: Parcel): Object => ({

    _pushModifierId: (prefix: string, updater: Function): string => {
        let id = updater._isParcelUpdater
            ? `s${HashFunction(updater._updater)}`
            : HashFunction(updater);

        return _this._id.pushModifier(`${prefix}-${id}`);
    },

    _getModifierUpdater: (updater: ParcelValueUpdater): ParcelDataEvaluator => {
        return updater._isParcelUpdater
            ? (parcelData: ParcelData): ParcelData => updater(parcelData)
            : (parcelData: ParcelData): ParcelData => {
                let {value} = parcelData;
                let updatedValue = updater(value, _this);
                ValidateValueUpdater(value, updatedValue);
                return setSelf(updatedValue)(parcelData);
            };
    },

    modifyDown: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyDown()`, `updater`, `function`)(updater);
        let parcelDataUpdater: ParcelDataEvaluator = _this._methods._getModifierUpdater(updater);
        return _this._create({
            id: _this._methods._pushModifierId('md', updater),
            parcelData: parcelDataUpdater(_this._parcelData),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.dispatch(changeRequest._addPre(parcelDataUpdater));
            }
        });
    },

    modifyUp: (updater: ParcelValueUpdater): Parcel => {
        Types(`modifyUp()`, `updater`, `function`)(updater);
        let parcelDataUpdater: ParcelDataEvaluator = pipe(
            _this._methods._getModifierUpdater(updater),
            checkCancellation
        );

        return _this._create({
            id: _this._methods._pushModifierId('mu', updater),
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.dispatch(changeRequest._addPost(parcelDataUpdater));
            }
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
            onDispatch: (changeRequest: ChangeRequest) => {
                _this.dispatch(changeRequest._addPost(parcelDataUpdater));
            }
        });
    }
});
