// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import Parcel from 'dataparcels';
import ChangeRequest from 'dataparcels/ChangeRequest';
import Action from 'dataparcels/lib/change/Action';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useCallback} from 'react';
// $FlowFixMe - useState is a named export of react
import {useMemo} from 'react';

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
    derive?: ParcelValueUpdater,
    revertKey?: string
};

let globalBufferCount = 0;

export default (params: Params): Parcel => {

    // params

    let {
        source,
        buffer = true,
        history = 0,
        derive = noop,
        revertKey
    } = params;

    // source

    let sourceRef = useRef();
    sourceRef.current = source;

    let [lastSource, setLastSource] = useState(null);
    let [innerParcel, setInnerParcel] = useState(null);

    // unique keying

    let [bufferId] = useState(() => globalBufferCount++);
    let originKey = () => `buffer-${sourceRef.current.id}`;

    // buffer and history

    let bufferParamRef = useRef();
    bufferParamRef.current = buffer;

    let frameRef = useRef(0);
    let [bufferStateRef, setBufferState] = useRefState([]);
    let [baseIndexRef, setBaseIndex] = useRefState(0);
    let [historyIndexRef, setHistoryIndex] = useRefState(0);
    let [altHistoryRef, setAltHistory] = useRefState(false);
    let [revertIndexRef, setRevertIndex] = useRefState(null);

    let logBuffer = () => {
        params.log && console.log(
            bufferStateRef.current
                .map(({parcel, frameOuter, frameInner}, index) => {
                    let h = historyIndexRef.current === index ? '>' : ' ';
                    let b = baseIndexRef.current === index ? 'b' : ' ';
                    let fu = frameOuter ? `^${frameOuter}` : '  ';
                    let fd = frameInner ? `v${frameInner}` : '  ';
                    return `${b}${h} [${index}] ${fu} ${fd} ${JSON.stringify(parcel.value)}`;
                })
                .join('\n')
        );
    };

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
        let historyIndex = historyIndexRef.current;
        let parcel = getHistoryParcel(historyIndex);
        let {frameInner} = bufferStateRef.current[historyIndex];

        parcel._treeShare.registry[parcel.id] = parcel;
        // ^ update the registry so changes will go to
        //   this parcel instead of potentially newer ones
        parcel._frameMeta.frame = frameInner;
        logBuffer();
        setInnerParcel(parcel);
    };

    let moveHistoryIndex = (index: number) => {
        setHistoryIndex(index);
        refreshInnerParcel();
    };

    let bufferReceive = (parcel: Parcel) => {
        let frameOuter = parcel._frameMeta.frame;

        let bufferState = bufferStateRef.current;
        let baseIndex = baseIndexRef.current;
        let historyIndex = historyIndexRef.current;

        let revertStatus = revertKey
            && revertIndexRef.current !== null
            && parcel.meta[`${revertKey}Status`];

        let max = -1;
        let frameOuterIndex = bufferState.reduceRight((result, item, index) => {
            if(result !== -1) return result;
            if(max === -1 && item.frameOuter) {
                max = item.frameOuter;
            }
            if(item.frameOuter <= frameOuter && frameOuter <= max) return index;
            return result;
        }, -1);

        if(frameOuterIndex !== -1) {
            moveHistoryIndex(frameOuterIndex);
            return;
        }

        let origin = parcel._frameMeta[originKey()];
        let frameInnerIndex = bufferState.findIndex(item => origin && item.frameInner === origin);
        if(frameInnerIndex !== -1) {
            let newBufferState = bufferState.slice();
            newBufferState[frameInnerIndex] = {...newBufferState[frameInnerIndex], parcel, frameOuter};
            setBufferState(newBufferState);
            refreshInnerParcel();
            return;
        }

        let beforeBase = bufferState.slice(0, baseIndex + 1);
        let afterBase = bufferState.slice(baseIndex + 1);

        let newBufferState = beforeBase
            // add the new item
            .concat({
                parcel,
                frameOuter,
                frameInner: ++frameRef.current
            })
            // sort so the new item appears in the right order
            .sort((a, b) => {
                if(a.frameOuter < b.frameOuter) return -1;
                if(a.frameOuter > b.frameOuter) return 1;
                return 0;
            })
            .concat(
                // reset parcels after the new one because their data might be different now
                afterBase.map(item => ({...item, parcel: undefined}))
            );

        if(bufferState.length > 0 && baseIndex >= beforeBase.length - 1) {
            baseIndex++;
        }

        if(bufferState.length > 0 && historyIndex >= beforeBase.length - 1) {
            historyIndex++;
        }

        //
        // let remainingCount = bufferStateRef.current.length - baseIndex;
        // if(revertStatus !== 'pending' && revertStatus !== 'rejected' && remainingCount > history) {
        //     // remove past items
        //     setBufferState(bufferStateRef.current.slice(baseIndex));
        //     setBaseIndex(0);
        //     setHistoryIndex(historyIndexRef.current - baseIndex);
        // }

        if(revertStatus === 'resolved') {
            setRevertIndex(null);
        } else if(revertStatus === 'rejected') {
            setBaseIndex(revertIndexRef.current);
            setRevertIndex(null);
        }

        setBufferState(newBufferState);
        setBaseIndex(baseIndex);
        setHistoryIndex(historyIndex);

        refreshInnerParcel();
    };

    let bufferPush = (parcel: Parcel, changeRequest: ChangeRequest) => {

        let newBufferState = bufferStateRef.current
            .slice(0, historyIndexRef.current + 1); // remove items ahead in history

        if(newBufferState.length < bufferStateRef.current.length) {
            // if we've gone back and branched off into a new history
            // compared with last submit, mark it as such
            setAltHistory(true);
            setBaseIndex(historyIndexRef.current);
        }

        newBufferState = newBufferState.concat({
            parcel,
            frameInner: ++frameRef.current,
            changeRequest: changeRequest._create({})
            // ^ clear changeRequest cache before storing this
            // so we dont use unnecessary memory
        });

        setBufferState(newBufferState);
        setHistoryIndex(bufferStateRef.current.length - 1);
        refreshInnerParcel();
    };

    let bufferSubmitCountRef = useRef(0);

    let bufferSubmit = () => {
        bufferSubmitCountRef.current++;

        let bufferState = bufferStateRef.current;
        let baseIndex = baseIndexRef.current;
        let historyIndex = historyIndexRef.current;

        let changeRequest;

        if(altHistoryRef.current || historyIndex < baseIndex) {
            // we're submitting from further into the past than the parent parcel
            // or from an alternate branch of history
            // and we can't derive the set of changes to make to reverse the actions that were undone
            // so for now just set the data outright
            let payload = getHistoryParcel(historyIndex).data;
            changeRequest = new ChangeRequest(
                new Action(({
                    type: 'basic.setData',
                    payload
                }))
            );

        } else {
            // we're submitting from further into the future than the parent parcel
            changeRequest = ChangeRequest.squash(
                bufferState
                    .slice(baseIndex + 1, historyIndex + 1)
                    .map(ii => ii.changeRequest)
            );
        }

        changeRequest._nextFrameMeta[originKey()] = bufferState[historyIndex].frameInner;
        sourceRef.current.dispatch(changeRequest);

        setRevertIndex(baseIndex);
        setBaseIndex(historyIndex);
        setAltHistory(false);

        logBuffer();
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
            ._boundarySplit(handleChange, bufferId);

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
                    canUndo: historyIndexRef.current > 0,
                    canRedo: historyIndexRef.current < bufferStateRef.current.length - 1,
                    synced: !!(baseIndexRef.current === historyIndexRef.current && !altHistoryRef.current),
                    _history: bufferStateRef.current,
                    _baseIndex: baseIndexRef.current
                }
            }))
            .modifyUp(derive);

    }, [
        innerParcel,
        bufferStateRef.current,
        historyIndexRef.current,
        baseIndexRef.current,
        altHistoryRef.current
    ]);
};

export const parcelEqual = (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa = parcelA.data;
    let bb = parcelB.data;
    let isChild = parcelA.isChild && parcelB.isChild;

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && Parcel.metaEquals(aa.meta, bb.meta)
        && (!isChild || (parcelA.isFirstChild === parcelB.isFirstChild && parcelA.isLastChild === parcelB.isLastChild));
};

