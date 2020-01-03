// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
import useParcelSideEffectSync from './useParcelSideEffectSync';
import Parcel from 'dataparcels';
import cancel from 'dataparcels/cancel';
import ApplyBeforeChange from './util/ApplyBeforeChange';

type OnChangeFunction = (parcel: Parcel, changeRequest: ChangeRequest) => any;

type Params = {
    value: any,
    updateValue?: boolean,
    rebase?: boolean,
    onChange?: ?OnChangeFunction|{sideEffectHook: Function},
    onChangeUseResult?: boolean,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, {[key: string]: any}];

export default (params: Params): Return => {

    let valueUpdater = typeof params.value === "function" ? params.value : () => params.value;
    let control = {};

    // takes a parcel and chains the beforeChange functions off of it
    // placing them each inside .modifyUp()s
    // so that all changes made to the returned parcel
    // go up through all of beforeChange's functions

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    // if value is asyncValue, make valueUpdater() call the asyncValue

    let parcelRef = useRef();
    if(valueUpdater._asyncValue) {

        let useAsyncValue = valueUpdater;
        // $FlowFixMe - useAsyncValue expects different arguments than valueUpdater
        let [asyncGetValue, valueStatus] = useAsyncValue((newValue) => {
            parcelRef.current
                .pipe(applyBeforeChange)
                .set(newValue);
        });

        valueUpdater = asyncGetValue;
        control.valueStatus = valueStatus;
    }

    // store parcel in state

    let [parcel, setParcel] = useState(() => {
        let parcel = new Parcel({
            handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
                // remember the origin of the last change
                // useParcelBufferInternalKeepValue needs it
                parcel._frameMeta.lastOriginId = changeRequest.originId;
                setParcel(parcel);
            }
        });

        return parcel._changeAndReturn(
            parcel => parcel
                .pipe(applyBeforeChange)
                .update(valueUpdater)
        )[0];
    });

    parcelRef.current = parcel;

    // use the updateValue param to set value from props

    if(params.updateValue) {
        parcel
            .modifyUp((value, changeRequest) => {
                return changeRequest.hasDataChanged() ? value : cancel;
            })
            .pipe(applyBeforeChange)
            .update(valueUpdater);
    }

    // use the rebase param

    if(params.rebase) {
        parcel._frameMeta.rebase = true;
    }

    // add the onChange handling logic to the parcel

    if(params.onChange) {

        let [parcelWithOnChange, changeStatus] = params.onChange.sideEffectHook
            ? params.onChange.sideEffectHook({
                parcel,
                onSideEffectUseResult: !!params.onChangeUseResult
            })
            : useParcelSideEffectSync({
                parcel,
                onSideEffect: params.onChange,
                onSideEffectUseResult: !!params.onChangeUseResult
            });

        parcel = parcelWithOnChange;

        if(changeStatus) {
            control.changeStatus = changeStatus;
        }
    }

    // add the beforeChange logic to the parcel

    parcel = parcel.pipe(applyBeforeChange);

    // return the parcel

    return [parcel, control];
};
