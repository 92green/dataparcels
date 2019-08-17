// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import composeWith from 'unmutable/lib/util/composeWith';
import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerInvalidStepError} from '../errors/Errors';

import del from '../parcelData/delete';
import deleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import insertAfter from '../parcelData/insertAfter';
import insertBefore from '../parcelData/insertBefore';
import map from '../parcelData/map';
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
    delete: del, //: (lastKey) => del(lastKey),
    insertAfter, //: (lastKey, value) => insertAfter(lastKey, value),
    insertBefore, //: (lastKey, value) => insertBefore(lastKey, value),
    map: (lastKey, updater) => map(updater),
    pop, //: () => pop(),
    push: (lastKey, values) => push(...values),
    setData: (lastKey, parcelData) => () => parcelData,
    setMeta: (lastKey, meta) => setMeta(meta),
    set: (lastKey, value) => setSelf(value),
    shift, //: () => shift(),
    swap, //: (lastKey, swapKey) => swap(lastKey, swapKey),
    swapNext, //: (lastKey) => swapNext(lastKey),
    swapPrev, //: (lastKey) => swapPrev(lastKey),
    unshift: (lastKey, values) => unshift(...values)
};

const parentActionMap = {
    delete: true,
    insertAfter: true,
    insertBefore: true,
    swap: true,
    swapNext: true,
    swapPrev: true
};

const stepMap = {
    get: ({key}, next) => parcelDataUpdate(key, next),
    md: ({updater}, next) => pipe(updater, next),
    mu: ({updater, changeRequest}, next) => (prevData) => {
        let nextData = next(prevData);
        return updater(
            nextData,
            changeRequest && changeRequest._create({
                prevData,
                nextData
            })
        );
    }
};

const doAction = ({keyPath, type, payload}: Action): ParcelDataEvaluator => {
    let fn = actionMap[type];
    if(!fn) {
        throw ReducerInvalidActionError(type);
    }
    return fn(keyPath.slice(-1)[0], payload);
};

const doDeepAction = (action: Action): ParcelDataEvaluator => {
    let {steps, type} = action;
    let isParentAction: boolean = !!(parentActionMap[type]);

    if(isParentAction) {
        if(action.keyPath.length === 0) {
            return type === "delete" ? deleteSelfWithMarker : ii => ii;
        }
        let lastGetIndex = steps.lastIndexOf(step => step.type === 'get');
        steps = steps.slice(0, lastGetIndex);
    }

    return composeWith(
        ...steps.map((step) => (next): ParcelDataEvaluator => {
            let fn = stepMap[step.type];
            if(!fn) {
                throw ReducerInvalidStepError(step.type);
            }
            return fn(step, next);
        }),
        doAction(action)
    );
};

export default (changeRequest: ChangeRequest) => (parcelData: ParcelData): ?ParcelData => {
    let cancelled = 0;
    let {actions} = changeRequest;

    let newParcelData = pipeWith(
        parcelData,
        ...actions.map((action): ParcelDataEvaluator => (parcelData: ParcelData): ParcelData => {
            try {
                return doDeepAction(action)(parcelData);
            } catch(e) {
                if(e.message === 'CANCEL') {
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
