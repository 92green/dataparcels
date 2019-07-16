// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import useDebouncedCallback from 'use-debounce/lib/callback';
import pipe from 'unmutable/pipe';

import Parcel from 'dataparcels';
import dangerouslyUpdateParcelData from 'dataparcels/dangerouslyUpdateParcelData';
import setMeta from 'dataparcels/lib/parcelData/setMeta';

import ApplyBeforeChange from './util/ApplyBeforeChange';
import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';
import pipeWithFakePrevParcel from './util/pipeWithFakePrevParcel';
import useParcelBufferInternalBuffer from './useParcelBufferInternalBuffer';
import useParcelBufferInternalKeepValue from './useParcelBufferInternalKeepValue';

const removeInternalMeta = (action) => {
    let {_submit, _reset} = action.payload.meta || {};
    let isInternalMeta = action.type === 'setMeta' && (_submit || _reset);
    return !isInternalMeta;
};

type Params = {
    parcel: Parcel,
    buffer?: boolean,
    debounce?: number,
    keepValue?: boolean,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, {[key: string]: any}];

export default (params: Params): Return => {

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    //
    // parcel state and change logic
    //

    // outerParcel is locked to changes in props
    const [outerParcel, setOuterParcel] = useState(null);
    // innerParcel can deviate from props
    const [innerParcel, setInnerParcel] = useState(null);
    // shouldKeepValue
    const shouldKeepValue = useParcelBufferInternalKeepValue(params);

    //
    // inner parcel prep
    //

    // 1. always apply applyBeforeChange to inner parcel
    //    so changes to innerParcel go up through beforeChange functions
    // 2. always add and set buffer meta to be passed to innerParcel

    const applyBufferMeta = (parcel) => parcel
        .modifyDown(dangerouslyUpdateParcelData(
            setMeta({
                _submit: false,
                _reset: false
            })
        ));

    const applyModifiers = pipe(
        applyBeforeChange,
        applyBufferMeta
    );

    const prepareKeepValue = (parcel: Parcel): Parcel => {
        // set existing value and child on the new parcel from props
        let data = {
            ...parcel.data,
            value: innerParcel.value,
            child: innerParcel.child
        };

        let [changedParcel] = parcel._changeAndReturn(
            parcel => parcel._setData(data)
        );

        return changedParcel;
    };

    const prepareInnerParcelFromOuter = () => {
        // if keepValue is used, beforeChange is ignored
        if(params.keepValue) {
            return shouldKeepValue ? prepareKeepValue : parcel => parcel;
        }
        return pipeWithFakePrevParcel(outerParcel, applyBeforeChange);
        // ^ this runs a parcel through beforeChange immediately
        // shoving outerParcel in as a fake previous value
    };

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

            params.parcel.dispatch(changeRequest);
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
            const {debounce, buffer = true, keepValue} = params;

            // remember the origin of the last change
            // useParcelBufferInternalKeepValue needs it
            newParcel._frameMeta = {
                lastOriginId: changeRequest.originId
            };

            // remove buffer actions meta from change request
            // and push any remaining change into the buffer
            let actions = changeRequest._actions.filter(removeInternalMeta);
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
                // if keepValue is true, the buffer is in change of its own state
                // rather than waiting for new props containing the new value
                keepValue && setInnerParcel(newParcel.pipe(applyModifiers));
            }

            // trigger buffer actions if meta says so
            const {_submit, _reset} = newParcel.meta;
            _submit && internalBuffer.submit();
            _reset && internalBuffer.reset();
        };

        const newOuterParcel = params.parcel;
        setOuterParcel(newOuterParcel);

        // clear buffer if it exists and if we aren't rebasing
        if(internalBuffer.bufferState && newOuterParcel._frameMeta.mergeMode !== "rebase") {
            internalBuffer.reset();
        }

        // boundary split to ensure that inner parcels chain are
        // completely isolated from outer parcels chain
        newInnerParcel = params.parcel
            ._boundarySplit({handleChange})
            .pipe(prepareInnerParcelFromOuter())
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
        submit: () => returnedParcel.setMeta({_submit: true}),
        reset: () => returnedParcel.setMeta({_reset: true}),
        buffered: actions.length > 0,
        actions,
        _outerParcel: params.parcel
    };

    //
    // return
    //

    return [returnedParcel, parcelControl];
};
