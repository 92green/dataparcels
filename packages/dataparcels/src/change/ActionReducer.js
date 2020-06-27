// @flow
import type {ParcelData} from '../types/Types';
import type TypeSet from '../typeHandlers/TypeSet';
import Action from './Action';

type ParcelDataEvaluator = (parcelData: ParcelData) => ?ParcelData;

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
        'reducer.batch': (parcelData, {payload, key, actFromParent}) => {
            console.log('actFromParent', actFromParent);
            if(actFromParent) {
                payload = payload.map(action => new Action({
                    type: action.type,
                    payload: action.payload,
                    keyPath: [key, ...action.keyPath]
                }));
            }
            return doDeepActionArray(payload, parcelData);
        }
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
            childParcelData = _get(parcelData, key, undefined, valueType)[0];
        } catch(e) {
            return parcelData;
        }

        return _set(parcelData, key, next(childParcelData), valueType);
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

    const doAction = ({keyPath, type, payload}: Action, actFromParent: boolean) => (parcelData: ParcelData): ParcelData => {
        let typeHandler = typeSet.getType(parcelData);
        if(actionHandlers[`${type}.homogeneous`]) {
            let typeName = type.split('.')[0];
            let compatibleTypes = [typeHandler.name].concat(typeHandler.compatibleWith || []);
            if(!compatibleTypes.includes(typeName)) {
                return parcelData;
            }
        }
        let key = keyPath.slice(-1)[0];
        // create child keys if not already
        parcelData = typeSet.createChildKeys(parcelData, true);
        return actionMap[type](parcelData, {
            payload,
            createChildKeys,
            updateValueAndChild,
            key,
            type: typeHandler,
            actFromParent
        });
    };

    const doDeepAction = (action: Action): ParcelDataEvaluator => {
        let {steps, type} = action;

        let isChildAction = type.split('.')[1] === 'child';
        let isBatch = type === 'reducer.batch';
        let actFromParent = false;

        if(isChildAction || isBatch) {
            let lastGetIndex = steps.map(step => step.type === 'get').lastIndexOf(true);
            if(lastGetIndex !== -1) {
                actFromParent = true;
                steps = steps.slice(0, lastGetIndex);
            } else if(isChildAction) {
                // child actions cannot be performed from the point of view of the child,
                // so just pass through
                return data => data;
            }
        }

        return steps.reduceRight((next, step) => {
            let fn = stepMap[step.type];
            return fn(step, next);
        }, doAction(action, actFromParent));
    };

    const doDeepActionArray = (actions: Action|Action[], parcelData: ParcelData): ?ParcelData => {
        try {
            let result = [].concat(actions).reduce((parcelData, action) => {
                return doDeepAction(action)(parcelData);
            }, parcelData);
            // delete result.changeRequest;
            return result;
        } catch(e) {
            if(e.message === 'CANCEL') {
                return;
            }
            throw e;
        }
    };

    return doDeepActionArray;
};
