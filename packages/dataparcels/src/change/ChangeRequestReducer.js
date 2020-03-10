// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import pipe from 'unmutable/lib/util/pipe';
import findLastIndex from 'unmutable/lib/findLastIndex';
import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerInvalidStepError} from '../errors/Errors';

import del from '../parcelData/delete';
import deleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import insertAfter from '../parcelData/insertAfter';
import insertBefore from '../parcelData/insertBefore';
import push from '../parcelData/push';
import setMeta from '../parcelData/setMeta';
import setSelf from '../parcelData/setSelf';
import swap from '../parcelData/swap';
import swapNext from '../parcelData/swapNext';
import swapPrev from '../parcelData/swapPrev';
import unshift from '../parcelData/unshift';
import parcelDataUpdate from '../parcelData/update';

const actionMap = {
    delete: del, //: (lastKey) => del(lastKey),
    insertAfter, //: (lastKey, value) => insertAfter(lastKey, value),
    insertBefore, //: (lastKey, value) => insertBefore(lastKey, value),
    push: (lastKey, values) => push(...values),
    setData: (lastKey, parcelData) => () => parcelData,
    setMeta: (lastKey, meta) => setMeta(meta),
    set: (lastKey, value) => setSelf(value),
    swap, //: (lastKey, swapKey) => swap(lastKey, swapKey),
    swapNext, //: (lastKey) => swapNext(lastKey),
    swapPrev, //: (lastKey) => swapPrev(lastKey),
    unshift: (lastKey, values) => unshift(...values),
    update: (lastKey, updater) => updater
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

        let lastGetIndex = findLastIndex(step => step.type === 'get')(steps);
        steps = steps.slice(0, lastGetIndex);
    }

    return steps.reduceRight((next, step) => {
        let fn = stepMap[step.type];
        if(!fn) {
            throw ReducerInvalidStepError(step.type);
        }
        return fn(step, next);
    }, doAction(action));
};

export default (changeRequest: ChangeRequest) => (parcelData: ParcelData): ?ParcelData => {
    let someSucceeded = false;
    return changeRequest.actions.reduce((parcelData, action) => {
        try {
            let newParcelData = doDeepAction(action)(parcelData);
            someSucceeded = true;
            return newParcelData;
        } catch(e) {
            if(e.message === 'CANCEL') {
                return someSucceeded ? parcelData : undefined;
            }
            throw e;
        }
    }, parcelData);
};
