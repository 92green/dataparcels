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

    let [bufferStateRef, setBufferState] = useRefState([{}]);
    let [baseIndexRef, setBaseIndex] = useRefState(0);
    let [historyIndexRef, setHistoryIndex] = useRefState(0);

    let refreshInnerParcel = () => {
        // look backward until last history parcel is found...
        let end =  bufferStateRef.current.length;
        let start = end + 1;
        let parcel;
        do {
            parcel = bufferStateRef.current[--start - 1].parcel;
        } while(!parcel);

        // ...and regenerate subsequent parcels by replaying each change on top of the last
        if(start < end) {
            let newBufferState = bufferStateRef.current.slice();
            for(let i = start; i < end; i++) {
                let {changeRequest} = newBufferState[i];
                parcel = parcel._changeAndReturn(pp => pp.dispatch(changeRequest))[0];
                newBufferState[i] = {...newBufferState[i], parcel};
            }
            setBufferState(newBufferState);
        }

        setInnerParcel(bufferStateRef.current[historyIndexRef.current].parcel);
    };

    let bufferReceive = (parcel: Parcel) => {

        // for now, remove all items in buffer before base index
        let numberOfObsoleteItems = baseIndexRef.current;
        setBufferState(bufferStateRef.current.slice(numberOfObsoleteItems));
        setBaseIndex(0);
        setHistoryIndex(historyIndexRef.current - numberOfObsoleteItems);

        // replace buffered parcel at the base index
        // and remove all cached parcels after this in history
        let newBufferState = bufferStateRef.current.map((item, index) => {
            // uncomment this once all items before base index are no longer deleted
            // if(index < baseIndexRef.current) return item;
            if(index === baseIndexRef.current) return {parcel, received: true};
            return {...item, parcel: undefined};
        });

        setBufferState(newBufferState);
        refreshInnerParcel();
    };

    let bufferPush = (parcel: Parcel, changeRequest: ChangeRequest) => {
        let newBufferState = bufferStateRef.current
            .slice(0, historyIndexRef.current + 1) // remove items ahead in history
            .concat({parcel, changeRequest});

        setBufferState(newBufferState);
        setHistoryIndex(bufferStateRef.current.length - 1);
        refreshInnerParcel();
    };

    let moveHistoryIndex = (index: number) => {
        let parcel = bufferStateRef.current[index].parcel;
        parcel._treeShare.registry[parcel.id] = parcel;
        // ^ update the registry so changes will go to
        //   this older parcel instead of newer ones
        setHistoryIndex(index);
        refreshInnerParcel();
    };

    let bufferSubmitCountRef = useRef(0);

    let bufferSubmit = () => {
        bufferSubmitCountRef.current++;

        let changeRequests = bufferStateRef.current
            .slice(baseIndexRef.current + 1, historyIndexRef.current + 1)
            .map(ii => ii.changeRequest);

        sourceRef.current.dispatch(ChangeRequest.squash(changeRequests));
        setBaseIndex(historyIndexRef.current);
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
            ._boundarySplit({handleChange});

        bufferReceive(innerParcel);
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

