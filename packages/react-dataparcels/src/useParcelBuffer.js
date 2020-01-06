// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useRef is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import useDebouncedCallback from 'use-debounce/lib/callback';
import pipe from 'unmutable/pipe';

import Parcel from 'dataparcels';
import asRaw from 'dataparcels/asRaw';
import setMeta from 'dataparcels/lib/parcelData/setMeta';

import ApplyBeforeChange from './util/ApplyBeforeChange';
import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';
import pipeWithFakePrevParcel from './util/pipeWithFakePrevParcel';
import useParcelBufferInternalBuffer from './useParcelBufferInternalBuffer';

type Params = {
    parcel: Parcel,
    buffer?: boolean,
    debounce?: number,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, {[key: string]: any}];

export default (params: Params): Return => {

    let parcelRef = useRef();
    parcelRef.current = params.parcel;

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    //
    // parcel state and change logic
    //

    // outerParcel is locked to changes in props
    const [outerParcel, setOuterParcel] = useState(null);
    // innerParcel can deviate from props
    const [innerParcel, setInnerParcel] = useState(null);

    //
    // inner parcel prep
    //

    // 1. always apply applyBeforeChange to inner parcel
    //    so changes to innerParcel go up through beforeChange functions
    // 2. always add and set buffer meta to be passed to innerParcel

    const applyBufferMeta = (parcel) => parcel
        .modifyDown(asRaw(
            setMeta({
                _control: null
            })
        ));

    const applyModifiers = pipe(
        applyBeforeChange,
        applyBufferMeta
    );

    //
    // buffer ref and functions
    //

    const internalBuffer = useParcelBufferInternalBuffer({
        onReset: () => setOuterParcel(null),
        // ^ resets by recreating innerParcel from outerParcel
        onSubmit: (changeRequest) => {

            changeRequest._revertCallback = (changeRequest: ChangeRequest) => {
                internalBuffer.unshift(changeRequest);
            };

            parcelRef.current.dispatch(changeRequest);
        }
        // ^ submits by dispatching the buffered change request
    });

    //
    // debounce
    //

    const [
        debounceRelease,
        /* blank */,
        callDebounceRelease
    ] = useDebouncedCallback(internalBuffer.submit, params.debounce);

    if(!params.debounce) {
        callDebounceRelease();
    }

    //
    // update inner parcel when outer parcel changes (or is first set)
    //

    let newInnerParcel;
    if(!outerParcel || !ParcelBoundaryEquals(params.parcel, outerParcel)) {

        const handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {
            const {debounce, buffer = true} = params;

            // remove buffer actions meta from change request
            // and push any remaining change into the buffer
            let actions = changeRequest._actions.filter((action) => {
                return !(action.type === 'setMeta' && action.payload._control);
            });

            if(actions.length > 0) {
                internalBuffer.push(changeRequest._create({actions}));
            }

            if(buffer || debounce) {
                // if buffer is to be used, update inner parcel immediately
                // and request a debounced submit if debounce is set
                setInnerParcel(newParcel.pipe(applyModifiers));
                debounce && debounceRelease();

            } else {
                // if no buffer, just propagate it immediately
                internalBuffer.submit();
            }

            // trigger buffer actions if meta says so
            const {_control} = newParcel.meta;
            _control === 'submit' && internalBuffer.submit();
            _control === 'reset' && internalBuffer.reset();
        };

        const newOuterParcel = params.parcel;
        setOuterParcel(newOuterParcel);

        // clear buffer if it exists and if we aren't rebasing
        if(internalBuffer.bufferState && !newOuterParcel._frameMeta.rebase) {
            internalBuffer.reset();
        }

        // boundary split to ensure that inner parcels chain are
        // completely isolated from outer parcels chain
        newInnerParcel = params.parcel
            ._boundarySplit({handleChange})
            .pipe(pipeWithFakePrevParcel(outerParcel, applyBeforeChange))
            ._changeAndReturn(parcel => {
                // apply buffered changes to new parcel from props
                let changeRequest = internalBuffer.bufferState;
                changeRequest && parcel.dispatch(changeRequest);
            })[0]
            .pipe(applyModifiers);

        setInnerParcel(newInnerParcel);
    }

    let returnedParcel: Parcel = innerParcel || newInnerParcel;

    //
    // parcel buffer control
    //

    let actions = internalBuffer.bufferState
        ? internalBuffer.bufferState.actions
        : [];

    const parcelControl = {
        submit: () => returnedParcel.setMeta({_control: 'submit'}),
        reset: () => returnedParcel.setMeta({_control: 'reset'}),
        buffered: actions.length > 0,
        actions,
        _outerParcel: params.parcel
    };

    //
    // return
    //

    return [returnedParcel, parcelControl];
};
