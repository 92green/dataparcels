// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import butLast from 'unmutable/lib/butLast';
import isEmpty from 'unmutable/lib/isEmpty';
import last from 'unmutable/lib/last';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

import parcelDelete from '../parcelData/delete';
import parcelInsertAfter from '../parcelData/insertAfter';
import parcelInsertBefore from '../parcelData/insertBefore';
import parcelPop from '../parcelData/pop';
import parcelPush from '../parcelData/push';
import parcelSet from '../parcelData/set';
import parcelSetSelf from '../parcelData/setSelf';
import parcelShift from '../parcelData/shift';
import parcelSwap from '../parcelData/swap';
import parcelSwapNext from '../parcelData/swapNext';
import parcelSwapPrev from '../parcelData/swapPrev';
import parcelUnshift from '../parcelData/unshift';
import parcelUpdateIn from '../parcelData/updateIn';
import updateChild from '../parcelData/updateChild';
import updateChildKeys from '../parcelData/updateChildKeys';

import Action from './Action';

export default function MultiReducer(parcelData: ParcelData, action: Action|Action[]): ParcelData {
    let actionArray: Action[] = Array.isArray(action) ? action : [action];
    let reduced: ParcelData = actionArray.reduce(Reducer, parcelData);
    return {
        value: undefined,
        meta: {},
        ...reduced
    };
}

function Reducer(parcelData: ParcelData, action: Action|Action[]): ParcelData {
    if(!(action instanceof Action)) {
        throw new Error(`Reducer must receive an Action`);
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

    let updateIn = (keyPath: Array<Key|Index>, updater: Function) => pipeWith(
        parcelData,
        parcelUpdateIn(
            keyPath,
            pipe(
                updateChild(),
                updateChildKeys(),
                updater
            )
        )
    );

    switch(type) {
        case "delete": {
            if(keyPathIsEmpty) {
                throw new Error(`Delete actions must have a keyPath with at least one key`);
            }
            return updateIn(
                keyPathButLast,
                parcelDelete(keyPathLast)
            );
        }

        case "insertAfter": {
            if(keyPathIsEmpty) {
                throw new Error(`InsertAfter actions must have a keyPath with at least one key`);
            }
            return updateIn(
                keyPathButLast,
                parcelInsertAfter(keyPathLast, {value})
            );
        }

        case "insertBefore": {
            if(keyPathIsEmpty) {
                throw new Error(`InsertBefore actions must have a keyPath with at least one key`);
            }
            return updateIn(
                keyPathButLast,
                parcelInsertBefore(keyPathLast, {value})
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
                parcelPush({value})
            );
        }

        case "set": {
            if(keyPathIsEmpty) {
                return parcelSetSelf({value})(parcelData);
            }

            return updateIn(
                keyPathButLast,
                parcelSet(keyPathLast, {value})
            );
        }

        case "setMeta": {
            if(keyPathIsEmpty) {
                return parcelSetSelf({meta})(parcelData);
            }

            return updateIn(
                keyPathButLast,
                parcelSet(keyPathLast, {meta})
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
                throw new Error(`Swap actions must have a keyPath with at least one key`);
            }
            let {swapKey} = action.payload;
            if(typeof swapKey === "undefined") {
                throw new Error(`Swap actions must have a swapKey in their payload`);
            }

            return updateIn(
                keyPathButLast,
                parcelSwap(keyPathLast, swapKey)
            );
        }

        case "swapNext": {
            if(keyPathIsEmpty) {
                throw new Error(`SwapNext actions must have a keyPath with at least one key`);
            }

            return updateIn(
                keyPathButLast,
                parcelSwapNext(keyPathLast)
            );
        }

        case "swapPrev": {
            if(keyPathIsEmpty) {
                throw new Error(`SwapPrev actions must have a keyPath with at least one key`);
            }

            return updateIn(
                keyPathButLast,
                parcelSwapPrev(keyPathLast)
            );
        }

        case "unshift": {
            return updateIn(
                keyPath,
                parcelUnshift({value})
            );
        }
    }

    throw new Error(`"${action.type}" is not a valid action`);
}
