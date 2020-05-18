// @flow
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';
import type TypeSet from '../typeHandlers/TypeSet';

export default (typeSet: TypeSet) => {

    let actionHandlers = typeSet.types.reduce((handlers, type) => ({
        ...handlers,
        ...(type.actionHandlers || {})
    }), {});

    let updateValueAndChild = (parcelData: ParcelData, updater: Function = ii => ii): ParcelData => {
        return {
            ...parcelData,
            value: updater(parcelData.value),
            child: updater(parcelData.child)
        };
    };

    let {createChildKeys} = typeSet;

    const actionMap = {
        ...actionHandlers,
        'reducer.batch': (parcelData, {payload}) => doDeepActionArray(payload, parcelData)
    };

    let get = ({key}, next) => (parcelData: ParcelData) => {
        let valueType = typeSet.getType(parcelData);

        let {_get, _set} = valueType.internalProperties || {};
        if(!_set) {
            return parcelData;
        }

        // create child keys if not already
        parcelData = typeSet.createChildKeys(parcelData, true);

        let childParcelData;
        try {
            childParcelData = _get(parcelData, key)[0];
        } catch(e) {
            return parcelData;
        }

        return _set(parcelData, key, next(childParcelData));
    };

    const stepMap = {
        get,
        md: ({updater}, next) => (prevData) => next(updater(prevData)),
        mu: ({updater, changeRequest, effectUpdate}, next) => (prevData) => {
            let nextData = next(prevData);
            let {effect, ...updated} = updater(
                nextData,
                changeRequest && changeRequest._create({
                    prevData,
                    nextData
                })
            );

            if(effect) {
                effect(effectUpdate);
            }

            return updated;
        }
    };

    const doAction = ({keyPath, type, payload}: Action) => (parcelData: ParcelData): ParcelData => {
        if(actionHandlers[`${type}.homogeneous`]) {
            // $FlowFixMe - don't worry, last item will always return true
            let {name} = typeSet.getType(parcelData);
            let typeName = type.split('.')[0];
            if(name !== typeName) {
                return parcelData;
            }
        }
        let key = keyPath.slice(-1)[0];
        // create child keys if not already
        parcelData = typeSet.createChildKeys(parcelData, true);
        return actionMap[type](parcelData, {payload, createChildKeys, updateValueAndChild, key});
    };

    const doDeepAction = (action: Action): ParcelDataEvaluator => {
        let {steps, type} = action;

        if(type.split('.')[1] === 'child') {
            let lastGetIndex = steps.map(step => step.type === 'get').lastIndexOf(true);
            steps = steps.slice(0, lastGetIndex);
        }

        return steps.reduceRight((next, step) => {
            let fn = stepMap[step.type];
            return fn(step, next);
        }, doAction(action));
    };

    const doDeepActionArray = (actions: Action|Action[], parcelData: ParcelData): ?ParcelData => {
        try {
            return [].concat(actions).reduce((parcelData, action) => {
                return doDeepAction(action)(parcelData);
            }, parcelData);
        } catch(e) {
            if(e.message === 'CANCEL') {
                return;
            }
            throw e;
        }
    };

    return doDeepActionArray;
};
