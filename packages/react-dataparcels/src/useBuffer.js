// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import Parcel from 'dataparcels';
import ChangeRequest from 'dataparcels/ChangeRequest';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useCallback} from 'react';
// $FlowFixMe - useState is a named export of react
import {useMemo} from 'react';

import shallowEquals from 'unmutable/lib/shallowEquals';

const useRefState = (initial) => {
    let [value, setValue] = useState(initial);
    let valueRef = useRef();
    valueRef.current = value;
    return [valueRef, (value) => {
        valueRef.current = value;
        setValue(value);
    }];
};

const noop = () => {};

type Params = {
    source: Parcel,
    buffer?: boolean|number,
    derive?: ParcelValueUpdater
};

export default (params: Params): Parcel => {

    // params

    let {
        source,
        buffer = true,
        derive = noop
    } = params;

    // source

    let sourceRef = useRef();
    sourceRef.current = source;

    let [lastSource, setLastSource] = useState(null);
    let [innerParcel, setInnerParcel] = useState(null);

    // buffer and history

    let bufferParamRef = useRef();
    bufferParamRef.current = buffer;

    let [bufferStateRef, setBufferState] = useRefState([]);
    let [baseIndexRef, setBaseIndex] = useRefState(0);
    let [historyIndexRef, setHistoryIndex] = useRefState(0);

    let bufferPush = (parcel: Parcel, changeRequest: ?ChangeRequest) => {
        let newBufferState = bufferStateRef.current
            .slice(0, historyIndexRef.current + 1) // remove items ahead in history
            .concat({
                index: baseIndexRef.current,
                parcel,
                changeRequest
            });

        setInnerParcel(parcel);
        setBufferState(newBufferState);
        setHistoryIndex(bufferStateRef.current.length - 1);
    };

    let moveHistoryIndex = (index: number) => {
        let parcel = bufferStateRef.current[index].parcel;
        parcel._treeShare.registry[parcel.id] = parcel;
        // ^ update the registry so changes will go to
        //   this older parcel instead of newer ones
        setInnerParcel(parcel);
        setHistoryIndex(index);
    };

    let bufferSubmitCountRef = useRef(0);

    let bufferSubmit = () => {
        bufferSubmitCountRef.current++;

        let bufferState = bufferStateRef.current;

        let changeRequests = bufferState
            .slice(baseIndexRef.current)
            .map(ii => ii.changeRequest)
            .filter(Boolean);

        let squashed = ChangeRequest.squash(changeRequests);
        sourceRef.current.dispatch(squashed);

        setBaseIndex(bufferState.length);
    };

    let bufferSubmitDebounce = (ms: number) => {
        let count = ++bufferSubmitCountRef.current;
        setTimeout(() => count === bufferSubmitCountRef.current && bufferSubmit(), ms);
    };

    let bufferReset = () => {
        let bufferState = bufferStateRef.current.slice(0, baseIndexRef.current + 1);
        setBufferState(bufferState);
        moveHistoryIndex(bufferState.length - 1);
    };

    let bufferUndo = () => {
        let index = historyIndexRef.current;
        if(index > 0) {
            moveHistoryIndex(index - 1);

        }
    };

    let bufferRedo = () => {
        let index = historyIndexRef.current;
        if(index < bufferStateRef.current.length - 1) {
            moveHistoryIndex(index + 1);
        }
    };

    let submit = useCallback(bufferSubmit, []);
    let reset = useCallback(bufferReset, []);
    let undo = useCallback(bufferUndo, []);
    let redo = useCallback(bufferRedo, []);

    // state sync and handle change

    if(!lastSource || !parcelEqual(lastSource, source)) {
        setLastSource(source);

        let handleChange = (parcel, changeRequest) => {
            bufferPush(parcel, changeRequest);

            let buffer = bufferParamRef.current;
            if(!buffer) {
                bufferSubmit();
            } else if(typeof buffer === 'number' && buffer > 0) {
                bufferSubmitDebounce(buffer);
            }
        };

        innerParcel = source
            .modifyDown(derive)
            ._boundarySplit({handleChange})
            .pipe(parcel => bufferStateRef.current
                .slice(baseIndexRef.current)
                .reduce((accParcel, {changeRequest}) => {
                    return accParcel._changeAndReturn(pp => pp.dispatch(changeRequest))[0];
                }, parcel));

        bufferPush(innerParcel);
    }

    // return

    return useMemo(() => {
        return innerParcel
            .modifyDown(() => ({
                meta: {
                    submit,
                    reset,
                    undo,
                    redo,
                    canSubmit: baseIndexRef.current < bufferStateRef.current.length - 1,
                    canUndo: historyIndexRef.current > 0,
                    canRedo: historyIndexRef.current < bufferStateRef.current.length - 1,
                    _history: bufferStateRef.current
                }
            }))
            .modifyUp(derive);

    }, [
        innerParcel,
        bufferStateRef.current,
        historyIndexRef.current,
        baseIndexRef.current
    ]);
};

export const parcelEqual = (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa = parcelA.data;
    let bb = parcelB.data;
    let isChild = parcelA.isChild && parcelB.isChild;

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta)
        && (!isChild || (parcelA.isFirstChild === parcelB.isFirstChild && parcelA.isLastChild === parcelB.isLastChild));
};

