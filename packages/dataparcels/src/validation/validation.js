// @flow

import type {ParcelDataEvaluator} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';

import asRaw from '../parcelData/asRaw';
import parcelDataMap from '../parcelData/map';
import parcelDataSetMeta from '../parcelData/setMeta';
import parcelDataUpdate from '../parcelData/update';

import composeWith from 'unmutable/composeWith';
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

        if(meta._submit) {
            showInvalid = true;
        }

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
                        .reduce((invalid, validator) => invalid || validator(parcelData.value, {keyPath, topLevelValue}), "");

                    if(invalid && showInvalid) {
                        invalidList.push(invalid);
                    } else {
                        invalid = undefined;
                    }

                    return parcelDataSetMeta({invalid})(parcelData);
                }
            );
        };

        let updateMeta = (parcelData) => {
            let valid = invalidList.length === 0;
            let newMeta = {
                showInvalid,
                invalidList,
                valid,
                // _submit is meta that useParcelBuffer uses to trigger a submit
                // set this to false if a submit should not occur
                _submit: meta._submit && valid
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
