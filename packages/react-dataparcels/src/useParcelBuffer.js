// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import useDebouncedCallback from 'use-debounce/lib/callback';

import Parcel from 'dataparcels';

import ParcelBufferControl from './ParcelBufferControl';
import ApplyModifyBeforeUpdate from './util/ApplyModifyBeforeUpdate';
import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';
import pipeWithFakePrevParcel from './util/pipeWithFakePrevParcel';
import useParcelBufferInternalBuffer from './useParcelBufferInternalBuffer';
import useParcelBufferInternalKeepValue from './useParcelBufferInternalKeepValue';

type Config = {
    parcel: Parcel,
    debounce?: number,
    hold?: boolean,
    keepValue?: boolean,
    modifyBeforeUpdate?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, ParcelBufferControl];

export default (config: Config): Return => {

    //
    // parcel state and change logic
    //

    // parcelFromProps is locked to changes in props
    const [parcelFromProps, setParcelFromProps] = useState(null);
    // innerParcel can deviate from props
    const [innerParcel, setInnerParcel] = useState(null);

    const shouldKeepValue = useParcelBufferInternalKeepValue(config);
    let newInnerParcel;

    //
    // buffer ref and functions
    //

    const {
        bufferState,
        push,
        clear,
        release
    } = useParcelBufferInternalBuffer({
        onRelease: (changeRequest) => config.parcel.dispatch(changeRequest),
        onClear: () => setInnerParcel(parcelFromProps.inner)
    });

    // debounce

    const [debounceRelease, /* blank */, callDebounceRelease] = useDebouncedCallback(release, config.debounce);

    if(!config.debounce) {
        callDebounceRelease();
    }

    // update inner parcel when outer parcel changes (or is first set)

    if(!parcelFromProps || !ParcelBoundaryEquals(config.parcel, parcelFromProps.outer)) {

        const handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {
            const {debounce, hold} = config;

            // push change into the buffer
            push(changeRequest);

            if(!debounce && !hold) {
                // if no debounce or hold, just propagate it immediately
                release();
                // if keepValue is true, the buffer is in change of its own state
                // rather than waiting for new props containing the new value
                config.keepValue && setInnerParcel(newParcel);
                return;
            }

            // if debounce or hold, update inner parcel immediately
            // and request a debounded release if debounce is set
            setInnerParcel(newParcel);
            debounce && debounceRelease();
        };


        const prepareKeepValue = (parcel: Parcel): Parcel => {
            // set existing value and child on the new parcel from props
            return parcel._changeAndReturn(
                parcel => parcel._setData({
                    ...parcel.data,
                    value: innerParcel.value,
                    child: innerParcel.child
                })
            );
        };

        const prepareModifyBeforeUpdate = (parcel: Parcel): Parcel => {
            const applyModifyBeforeUpdate = ApplyModifyBeforeUpdate(config.modifyBeforeUpdate);
            return parcel.pipe(
                // runs newOuterParcel through modifyBeforeUpdate immediately
                // shoving lastReceivedOuterParcel in as a fake previous value
                pipeWithFakePrevParcel(
                    parcelFromProps && parcelFromProps.outer,
                    applyModifyBeforeUpdate
                ),
                // adds modifyBeforeUpdate to any future changes
                applyModifyBeforeUpdate
            );
        };

        // if keepValue is used, modifyBeforeUpdate is ignored
        const prepareInnerParcel = config.keepValue
            ? (shouldKeepValue ? prepareKeepValue : (parcel => parcel))
            : prepareModifyBeforeUpdate;

        const newOuterParcel = config.parcel;
        newInnerParcel = config.parcel
            // boundary split to ensure that inner parcels chain are
            // completely isolated from outer parcels chain
            ._boundarySplit({handleChange})
            .pipe(prepareInnerParcel);

        setInnerParcel(newInnerParcel);
        setParcelFromProps({
            outer: newOuterParcel,
            inner: newInnerParcel
        });
    }

    //
    // parcel buffer control
    //

    let actions = bufferState
        ? bufferState.actions
        : [];

    const parcelBufferControl = new ParcelBufferControl({
        release,
        clear,
        buffered: actions.length > 0,
        actions
    });

    return [innerParcel || newInnerParcel, parcelBufferControl];
};
