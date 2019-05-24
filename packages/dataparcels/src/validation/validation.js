// @flow

import type {ParcelDataEvaluator} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import dangerouslyUpdateParcelData from '../parcelData/dangerouslyUpdateParcelData';
import parcelDataMap from '../parcelData/map';
import parcelDataSetMeta from '../parcelData/setMeta';
import parcelDataUpdate from '../parcelData/update';

import composeWith from 'unmutable/composeWith';
import map from 'unmutable/map';
import pipeWith from 'unmutable/pipeWith';
import toArray from 'unmutable/toArray';

type ValidationRule = (value: any, keyPath: Array<any>) => any;

type ValidationRuleMap = {
    [matchPath: string]: ValidationRule|ValidationRule[]
};

export default (validatorMap: ValidationRuleMap): ParcelValueUpdater => {
    return dangerouslyUpdateParcelData((parcelData) => {
        let allValid = true;

        let mapValidationRuleApplier = (validator: ValidationRule|ValidationRule[], path: string): ParcelDataEvaluator => {
            let keyPath = path.split(".");

            return composeWith(
                ...keyPath.map((key) => key === "*"
                    ? (next) => parcelDataMap(next)
                    : (next) => parcelDataUpdate(key, next)
                ),
                (parcelData) => {
                    let invalid = []
                        .concat(validator)
                        .reduce((invalid, validator) => invalid || validator(parcelData.value, keyPath), "");

                    if(invalid) {
                        allValid = false;
                    } else {
                        invalid = undefined;
                    }

                    return parcelDataSetMeta({invalid})(parcelData);
                }
            );
        };

        return pipeWith(
            parcelData,
            ...pipeWith(
                validatorMap,
                map(mapValidationRuleApplier),
                toArray()
            ),
            (parcelData) => {
                let meta = parcelData.meta || {};

                let newMeta = {
                    valid: allValid,
                    _submit: meta._submit && allValid
                };

                return parcelDataSetMeta(newMeta)(parcelData);
            }
        );
    });
};
