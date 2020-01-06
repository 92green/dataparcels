// @flow

import type {ParcelDataEvaluator} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import asRaw from '../parcelData/asRaw';
import parcelDataMap from '../parcelData/map';
import parcelDataSetMeta from '../parcelData/setMeta';
import parcelDataUpdate from '../parcelData/update';

import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import toArray from 'unmutable/toArray';

type ValidationRuleMeta = {
    keyPath: Array<any>,
    topLevelValue: any
};

type ValidationRule = (value: any, other: ValidationRuleMeta) => any;

type ValidationRuleMap = {
    [matchPath: string]: ValidationRule|ValidationRule[]
};

export default (validatorMap: ValidationRuleMap): ParcelValueUpdater => {
    return asRaw((parcelData) => {
        let invalidList = [];
        let topLevelValue = parcelData.value;
        let meta = parcelData.meta || {};
        let showInvalid = !!meta.showInvalid;

        if(meta._control === 'submit') {
            showInvalid = true;
        }

        let mapValidationRuleApplier = (validator: ValidationRule|ValidationRule[], path: string): ParcelDataEvaluator => {
            let keyPath = path.split(".");
            let initial = (parcelData) => {
                let invalid = []
                    .concat(validator)
                    .reduce((invalid, validator) => invalid || validator(parcelData.value, {keyPath, topLevelValue}), "");

                if(invalid && showInvalid) {
                    invalidList.push(invalid);
                } else {
                    invalid = undefined;
                }

                return parcelDataSetMeta({invalid})(parcelData);
            };

            return keyPath.reduceRight((next, key) => {
                return key === "*" ? parcelDataMap(next) : parcelDataUpdate(key, next);
            }, initial);
        };

        let updateMeta = (parcelData) => {
            let valid = invalidList.length === 0;
            let newMeta = {
                showInvalid,
                invalidList,
                valid,
                // _control is meta that useParcelBuffer uses to trigger a submit or reset
                // set this to null if its trying to submit, and the submut should not occur
                _control: meta._control === 'submit' && !valid ? null : meta._control
            };
            return parcelDataSetMeta(newMeta)(parcelData);
        };

        return pipeWith(
            parcelData,
            ...pipeWith(
                validatorMap,
                map(mapValidationRuleApplier),
                toArray()
            ),
            updateMeta
        );
    });
};
