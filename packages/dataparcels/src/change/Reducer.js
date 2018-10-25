// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';

import {ReducerKeyPathRequiredError} from '../errors/Errors';
import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerSwapKeyError} from '../errors/Errors';

import butLast from 'unmutable/lib/butLast';
import isEmpty from 'unmutable/lib/isEmpty';
import last from 'unmutable/lib/last';

import parcelDelete from '../parcelData/delete';
import parcelDeleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import parcelInsert from '../parcelData/insert';

import parcelPop from '../parcelData/pop';
import parcelPush from '../parcelData/push';
import parcelSetMeta from '../parcelData/setMeta';
import parcelSetSelf from '../parcelData/setSelf';
import parcelShift from '../parcelData/shift';
import parcelSwap from '../parcelData/swap';
import parcelSwapNextPrev from '../parcelData/swapNextPrev';
import parcelUnshift from '../parcelData/unshift';
import parcelUpdateIn from '../parcelData/updateIn';

import Action from './Action';

export default function MultiReducer(parcelData: ParcelData, action: Action|Action[]): ParcelData {
    let actionArray: Action[] = Array.isArray(action) ? action : [action];
    let reduced: ParcelData = actionArray.reduce(Reducer, parcelData);
    return {
        value: undefined,
        ...reduced
    };
}

function Reducer(parcelData: ParcelData, action: Action|Action[]): ParcelData {
    if(!(action instanceof Action)) {
        throw Error(`Reducer must receive an Action`);
    }

    let {
        keyPath,
        payload: {
            value,
            meta
        },
        type
    } = action;

    let keyPathLast: Key|Index = last()(keyPath);
    let keyPathButLast: Array<Key|Index> = butLast()(keyPath);
    let keyPathIsEmpty: boolean = isEmpty()(keyPath);

    let updateIn = (keyPath, updater) => parcelUpdateIn(keyPath, updater)(parcelData);

    switch(type) {
        case "delete": {
            if(keyPathIsEmpty) {
                return parcelDeleteSelfWithMarker();
            }
            return updateIn(
                keyPathButLast,
                parcelDelete(keyPathLast)
            );
        }

        case "insertAfter": {
            if(keyPathIsEmpty) {
                throw ReducerKeyPathRequiredError(type);
            }
            return updateIn(
                keyPathButLast,
                parcelInsert(keyPathLast, value, true)
            );
        }

        case "insertBefore": {
            if(keyPathIsEmpty) {
                throw ReducerKeyPathRequiredError(type);
            }
            return updateIn(
                keyPathButLast,
                parcelInsert(keyPathLast, value, false)
            );
        }

        case "ping": {
            return parcelData;
        }

        case "pop": {
            return updateIn(
                keyPath,
                parcelPop()
            );
        }

        case "push": {
            return updateIn(
                keyPath,
                parcelPush(value)
            );
        }

        case "replace": {
            return updateIn(
                keyPath,
                parcelSetSelf(value, true)
            );
        }

        case "set": {
            return updateIn(
                keyPath,
                parcelSetSelf(value, false)
            );

        }

        case "setMeta": {
            return updateIn(
                keyPath,
                parcelSetMeta(meta)
            );
        }

        case "shift": {
            return updateIn(
                keyPath,
                parcelShift()
            );
        }

        case "swap": {
            if(keyPathIsEmpty) {
                throw ReducerKeyPathRequiredError(type);
            }
            let {swapKey} = action.payload;
            if(typeof swapKey === "undefined") {
                throw ReducerSwapKeyError();
            }

            return updateIn(
                keyPathButLast,
                parcelSwap(keyPathLast, swapKey)
            );
        }

        case "swapNext": {
            if(keyPathIsEmpty) {
                throw ReducerKeyPathRequiredError(type);
            }

            return updateIn(
                keyPathButLast,
                parcelSwapNextPrev(keyPathLast, true)
            );
        }

        case "swapPrev": {
            if(keyPathIsEmpty) {
                throw ReducerKeyPathRequiredError(type);
            }

            return updateIn(
                keyPathButLast,
                parcelSwapNextPrev(keyPathLast, false)
            );
        }

        case "unshift": {
            return updateIn(
                keyPath,
                parcelUnshift(value)
            );
        }
    }

    throw ReducerInvalidActionError(type);
}
