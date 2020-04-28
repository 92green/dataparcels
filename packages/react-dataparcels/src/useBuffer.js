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
    history?: number,
    derive?: ParcelValueUpdater
};

export default (params: Params): Parcel => {

    // params

    let {
        source,
        buffer = true,
        history = 0,
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
    let [altHistoryRef, setAltHistory] = useRefState(false);
    let [historyIndexRef, setHistoryIndex] = useRefState(0);

    let getHistoryParcel = (index: number): Parcel => {
        // look backward from index until cached parcel is found...
        let end = index + 1;
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

        return bufferStateRef.current[index].parcel;
    };

    let refreshInnerParcel = () => {
        let parcel = getHistoryParcel(historyIndexRef.current);
        parcel._treeShare.registry[parcel.id] = parcel;
        // ^ update the registry so changes will go to
        //   this parcel instead of potentially newer ones
        setInnerParcel(parcel);
    };

    let bufferReceive = (parcel: Parcel) => {

        let baseIndex = baseIndexRef.current;
        let remainingCount = bufferStateRef.current.length - baseIndex;
        if(remainingCount > history) {
            // remove past items
            setBufferState(bufferStateRef.current.slice(baseIndex));
            setBaseIndex(0);
            setHistoryIndex(historyIndexRef.current - baseIndex);
        }

        // replace buffered parcel at the base index
        // and clear all non-received cached parcels
        // - future ones might be different because of this rebase
        // - past ones are likely not going to be accessed soon
        // - received ones are not regeneratable so must be remembered
        let newBufferState = bufferStateRef.current.map((item, index) => {
            if(index === baseIndexRef.current) return {...item, parcel, received: true};
            if(item.received) return item;
            return {...item, parcel: undefined};
        });

        setBufferState(newBufferState);
        refreshInnerParcel();
    };

    let bufferPush = (parcel: Parcel, changeRequest: ChangeRequest) => {
        let newBufferState = bufferStateRef.current
            .slice(0, historyIndexRef.current + 1); // remove items ahead in history

        if(newBufferState.length < bufferStateRef.current.length) {
            // if we've gone back and branched off into a new history
            // compared with last submit, mark it as such
            setAltHistory(true);
        }

        newBufferState = newBufferState.concat({
            parcel,
            changeRequest: changeRequest._create({})
            // ^ clear changeRequest cache before storing this
            // so we dont use unnecessary memory
        });

        setBufferState(newBufferState);
        setHistoryIndex(bufferStateRef.current.length - 1);
        refreshInnerParcel();
    };

    let moveHistoryIndex = (index: number) => {
        setHistoryIndex(index);
        refreshInnerParcel();
    };

    let bufferSubmitCountRef = useRef(0);

    let bufferSubmit = () => {
        bufferSubmitCountRef.current++;
        let baseIndex = baseIndexRef.current;
        let historyIndex = historyIndexRef.current;

        if(altHistoryRef.current || historyIndex < baseIndex) {
            // we're submitting from further into the past than the parent parcel
            // or from an alternate branch of history
            // and we can't derive the set of changes to make to reverse the actions that were undone
            // so for now just set the data outright
            let {data} = getHistoryParcel(historyIndex);
            sourceRef.current._setData(data);

        } else {
            // we're submitting from further into the future than the parent parcel
            let changeRequests = bufferStateRef.current
                .slice(baseIndex + 1, historyIndex + 1)
                .map(ii => ii.changeRequest);

            sourceRef.current.dispatch(ChangeRequest.squash(changeRequests));
        }

        setBaseIndex(historyIndex);
        setAltHistory(false);
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

