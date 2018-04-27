// @flow
import butLast from 'unmutable/lib/butLast';
import isEmpty from 'unmutable/lib/isEmpty';
import last from 'unmutable/lib/last';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

import parcelDelete from '../parcelData/delete';
import parcelInsert from '../parcelData/insert';
import parcelPop from '../parcelData/pop';
import parcelPush from '../parcelData/push';
import parcelSet from '../parcelData/set';
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
    return actionArray.reduce(Reducer, parcelData);
}

function Reducer(parcelData: ParcelData, action: Action|Action[]): ParcelData {
    if(!(action instanceof Action)) {
        throw new Error(`Reducer must receive an Action`);
    }

    let {keyPath} = action;
    let keyPathLast: Key[] = last()(keyPath);
    let keyPathButLast: Key[] = butLast()(keyPath);
    let keyPathIsEmpty: boolean = isEmpty()(keyPath);

    let updateIn = (keyPath: Key[], updater: Function) => pipeWith(
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

    switch(action.type) {
        case "delete": {
            if(keyPathIsEmpty) {
                throw new Error(`Delete actions must have a keyPath with at least one key`);
            }
            return updateIn(
                keyPathButLast,
                parcelDelete(keyPathLast)
            );
        }

        case "insert": {
            if(keyPathIsEmpty) {
                throw new Error(`Insert actions must have a keyPath with at least one key`);
            }
            return updateIn(
                keyPathButLast,
                parcelInsert(keyPathLast, {value: action.payload.value})
            );
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
                parcelPush({value: action.payload.value})
            );
        }

        case "set": {
            if(keyPathIsEmpty) {
                return {value: action.payload.value};
            }

            return updateIn(
                keyPathButLast,
                parcelSet(keyPathLast, {value: action.payload.value})
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
            let {swapIndex} = action.payload;
            if(typeof swapIndex === "undefined") {
                throw new Error(`Swap actions must have a swapIndex in their payload`);
            }

            return updateIn(
                keyPathButLast,
                parcelSwap(keyPathLast, swapIndex)
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
                parcelUnshift({value: action.payload.value})
            );
        }
    }

    throw new Error(`"${action.type}" is not a valid action`);
}