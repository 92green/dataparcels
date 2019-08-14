// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
import Parcel from 'dataparcels';
import useParcelSideEffectSync from './useParcelSideEffectSync';
import ApplyBeforeChange from './util/ApplyBeforeChange';

type OnChangeFunction = (parcel: Parcel, changeRequest: ChangeRequest) => any;

type Params = {
    value: any,
    updateValue?: boolean,
    rebase?: boolean,
    onChange?: OnChangeFunction|{sideEffectHook: Function},
    onChangeUseResult?: boolean,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, {[key: string]: any}];

export default (params: Params): Return => {

    let getValue = typeof params.value === "function" ? params.value : () => params.value;
    let control = {};

    // takes a parcel and chains the beforeChange functions off of it
    // placing them each inside .modifyUp()s
    // so that all changes made to the returned parcel
    // go up through all of beforeChange's functions

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    // takes a parcel and sets the current params.value as its value
    // params.value is first passed through beforeChange

    const updateParcelValue = (parcel: Parcel, value: any): Parcel => {
        return parcel._changeAndReturn(
            parcel => applyBeforeChange(parcel).set(value)
        )[0];
    };

    // if value is asyncValue, make getValue() call the asyncValue

    let parcelRef = useRef();
    if(getValue._asyncValue) {

        let useAsyncValue = getValue;
        // $FlowFixMe - useAsyncValue expects different arguments than getValue
        let [asyncGetValue, valueStatus] = useAsyncValue((newValue) => {
            parcelRef.current
                .pipe(applyBeforeChange)
                .set(newValue);
        });

        getValue = asyncGetValue;
        control.valueStatus = valueStatus;
    }

    // store parcel in state

    let [parcel, setParcel] = useState(() => updateParcelValue(
        new Parcel({
            handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
                // remember the origin of the last change
                // useParcelBufferInternalKeepValue needs it
                parcel._frameMeta.lastOriginId = changeRequest.originId;
                setParcel(parcel);
            }
        }),
        getValue()
    ));
    parcelRef.current = parcel;

    // use the updateValue param to set value from props

    const [prevValue, setPrevValue] = useState(() => parcel.value);

    if(params.updateValue) {
        const value = getValue();

        if(!Object.is(value, prevValue)) {
            setPrevValue(value);
            setParcel(updateParcelValue(parcel, value));
        }
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
