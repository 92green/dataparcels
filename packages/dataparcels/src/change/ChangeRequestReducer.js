// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import findLastIndex from 'unmutable/lib/findLastIndex';
import identity from 'unmutable/lib/identity';
import last from 'unmutable/lib/last';
import take from 'unmutable/lib/take';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import composeWith from 'unmutable/lib/util/composeWith';

import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerInvalidStepError} from '../errors/Errors';
import {isCancelledError} from './CancelActionMarker';

import del from '../parcelData/delete';
import deleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import insertAfter from '../parcelData/insertAfter';
import insertBefore from '../parcelData/insertBefore';
import move from '../parcelData/move';
import pop from '../parcelData/pop';
import push from '../parcelData/push';
import setMeta from '../parcelData/setMeta';
import setSelf from '../parcelData/setSelf';
import shift from '../parcelData/shift';
import swap from '../parcelData/swap';
import swapNext from '../parcelData/swapNext';
import swapPrev from '../parcelData/swapPrev';
import unshift from '../parcelData/unshift';
import parcelDataUpdate from '../parcelData/update';

const actionMap = {
    delete: ({lastKey}) => del(lastKey),
    insertAfter: ({lastKey, value}) => insertAfter(lastKey, value),
    insertBefore: ({lastKey, value}) => insertBefore(lastKey, value),
    move: ({lastKey, moveKey}) => move(lastKey, moveKey),
    pop: () => pop(),
    push: ({values}) => push(...values),
    setData: parcelData => () => parcelData,
    setMeta: ({meta}) => setMeta(meta),
    set: ({value}) => setSelf(value),
    shift: () => shift(),
    swap: ({lastKey, swapKey}) => swap(lastKey, swapKey),
    swapNext: ({lastKey}) => swapNext(lastKey),
    swapPrev: ({lastKey}) => swapPrev(lastKey),
    unshift: ({values}) => unshift(...values)
};

const parentActionMap = {
    delete: true,
    insertAfter: true,
    insertBefore: true,
    move: true,
    swap: true,
    swapNext: true,
    swapPrev: true
};

const doAction = ({keyPath, type, payload}: Action): ParcelDataEvaluator => {
    let fn = actionMap[type];
    if(!fn) {
        throw ReducerInvalidActionError(type);
    }
    return fn({
        ...payload,
        lastKey: last()(keyPath)
    });
};

const doDeepAction = (action: Action): ParcelDataEvaluator => {
    let {steps, type} = action;
    let isParentAction: boolean = !!(parentActionMap[type]);

    if(isParentAction) {
        if(action.keyPath.length === 0) {
            return type === "delete" ? deleteSelfWithMarker : identity();
        }
        let lastGetIndex = findLastIndex(step => step.type === 'get')(steps);
        steps = take(lastGetIndex)(steps);
    }

    return composeWith(
        ...steps.map((step) => (next): ParcelDataEvaluator => {
            if(step.type === 'get') {
                // $FlowFixMe - I promise that step.key will exist
                return parcelDataUpdate(step.key, next);
            }
            if(step.type === 'md') {
                return pipe(
                    step.updater,
                    next
                );
            }
            if(step.type === 'mu') {
                return pipe(
                    next,
                    step.updater
                );
            }
            throw ReducerInvalidStepError(step.type);
        }),
        doAction(action)
    );
};

export default (changeRequest: ChangeRequest) => (parcelData: ParcelData): ?ParcelData => {
    let cancelled = 0;
    let actions = changeRequest.actions();

    let newParcelData = pipeWith(
        parcelData,
        ...actions.map((action): ParcelDataEvaluator => (parcelData: ParcelData): ParcelData => {
            try {
                return doDeepAction(action)(parcelData);
            } catch(e) {
                if(isCancelledError(e)) {
                    cancelled++;
                    return parcelData;
                }
                throw e;
            }
        })
    );

    return cancelled > 0 && cancelled === actions.length
        ? undefined
        : newParcelData;
};
