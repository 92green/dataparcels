// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import identity from 'unmutable/lib/identity';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import composeWith from 'unmutable/lib/util/composeWith';
import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerInvalidStepError} from '../errors/Errors';
import {isCancelledError} from './cancel';

import {del} from '../parcelData/parcelData';
import {deleteSelfWithMarker} from '../parcelData/parcelData';
import {insertAfter} from '../parcelData/parcelData';
import {insertBefore} from '../parcelData/parcelData';
import {map} from '../parcelData/parcelData';
import {move} from '../parcelData/parcelData';
import {pop} from '../parcelData/parcelData';
import {push} from '../parcelData/parcelData';
import {setMeta} from '../parcelData/parcelData';
import {setSelf} from '../parcelData/parcelData';
import {shift} from '../parcelData/parcelData';
import {swap} from '../parcelData/parcelData';
import {swapNext} from '../parcelData/parcelData';
import {swapPrev} from '../parcelData/parcelData';
import {unshift} from '../parcelData/parcelData';

import update from '../parcelData/update';

const actionMap = {
    delete: ({lastKey}) => del(lastKey),
    insertAfter: ({lastKey, value}) => insertAfter(lastKey, value),
    insertBefore: ({lastKey, value}) => insertBefore(lastKey, value),
    map: ({updater}) => map(updater),
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

const stepMap = {
    get: ({key}, next) => update(key, next),
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
    return fn({
        ...payload,
        lastKey: keyPath.slice(-1)[0]
    });
};

const doDeepAction = (action: Action): ParcelDataEvaluator => {
    let {steps, type} = action;
    let isParentAction: boolean = !!(parentActionMap[type]);

    if(isParentAction) {
        if(action.keyPath.length === 0) {
            return type === "delete" ? deleteSelfWithMarker : identity();
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
