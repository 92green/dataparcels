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

    // buffer

    let bufferParamRef = useRef();
    bufferParamRef.current = buffer;

    let [bufferState, setBufferState] = useState([]);
    let bufferSubmitCountRef = useRef(0);

    let bufferSubmit = () => {
        bufferSubmitCountRef.current++;
        setBufferState(bufferState => {
            // future perf improvement - merge as they come in, not on submit
            // but beware of how history can affect this
            let merged = bufferState.length > 0
                ? bufferState.reduce((prev, next) => prev.merge(next))
                : new ChangeRequest();

            sourceRef.current.dispatch(merged);
            return [];
        });
    };

    let bufferSubmitDebounce = (ms: number) => {
        let count = ++bufferSubmitCountRef.current;
        setTimeout(() => count === bufferSubmitCountRef.current && bufferSubmit(), ms);
    };

    let bufferReset = () => {
        setBufferState([]);
        setLastSource(null);
        // ^ remove last source to force innerParcel to update
    };

    let submit = useCallback(bufferSubmit, []);
    let reset = useCallback(bufferReset, []);

    // state sync and handle change

    if(!lastSource || !parcelEqual(lastSource, source)) {
        setLastSource(source);

        let handleChange = (parcel, changeRequest) => {
            setInnerParcel(parcel);
            setBufferState(bufferState => bufferState.concat(changeRequest));

            let buffer = bufferParamRef.current;
            if(!buffer) {
                bufferSubmit();
            } else if(typeof buffer === 'number' && buffer > 0) {
                bufferSubmitDebounce(buffer);
            }
        };

        innerParcel = source
            ._boundarySplit({handleChange})
            .modifyDown(derive);

        setInnerParcel(innerParcel);
    }

    // return

    return useMemo(() => {

        let buffered = bufferState.length > 0;

        return innerParcel
            .modifyDown(() => ({
                meta: {
                    submit,
                    reset,
                    buffered
                }
            }))
            .modifyUp(derive);

    }, [innerParcel, bufferState]);
};

const parcelEqual = (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa = parcelA.data;
    let bb = parcelB.data;
    let isChild = parcelA.isChild && parcelB.isChild;

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta)
        && (!isChild || (parcelA.isFirstChild === parcelB.isFirstChild && parcelA.isLastChild === parcelB.isLastChild));
};

