// @flow

import type {ContinueChainFunction} from '../types/Types';
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

type ValidationRuleMeta = {
    keyPath: Array<any>,
    topLevelValue: any
};

type ValidationRule = (value: any, other: ValidationRuleMeta) => any;

type ValidationRuleMap = {
    [matchPath: string]: ValidationRule|ValidationRule[]
};

type ValidationResult = {
    modifyBeforeUpdate: ParcelValueUpdater,
    onRelease: ContinueChainFunction
};

export default (validatorMap: ValidationRuleMap): ValidationResult => {
    let modifyBeforeUpdate = dangerouslyUpdateParcelData((parcelData) => {
        let topLevelValue = parcelData.value;
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
                        .reduce((invalid, validator) => invalid || validator(parcelData.value, {keyPath, topLevelValue}), "");

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
            (parcelData) => pipeWith(
                parcelData,
                parcelDataSetMeta({
                    valid: allValid
                })
            )
        );
    });

    // $FlowFixMe
    let shouldSubmit = (parcelData) => !!(parcelData.meta.valid);

    let onRelease = (continueRelease, changeRequest) => {
        changeRequest && shouldSubmit(changeRequest.nextData) && continueRelease();
    };

    return {
        modifyBeforeUpdate,
        onRelease
    };
};
