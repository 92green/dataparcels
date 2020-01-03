// @flow

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import type Parcel from 'dataparcels';
import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

import useParcelState from './useParcelState';
import useParcelBuffer from './useParcelBuffer';
import asyncChange from './asyncChange';

type OnChangeFunction = (parcel: Parcel, changeRequest: ChangeRequest) => any;

type Params = {
    value: any,
    updateValue?: boolean,
    rebase?: boolean,
    onSubmit?: OnChangeFunction,
    onSubmitUseResult?: boolean,
    buffer?: boolean,
    debounce?: number,
    validation?: ParcelValueUpdater|() => ParcelValueUpdater,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, {[key: string]: any}];

export default (params: Params): Return => {

    let {
        value,
        updateValue = false,
        rebase = false,
        onSubmit,
        onSubmitUseResult = false,
        buffer = true,
        debounce = 0,
        validation,
        beforeChange
    } = params;

    const [validationFn] = useState(() => (validation && validation.length === 0)
        ? validation()
        : undefined
    );

    beforeChange = [
        validationFn || validation,
        ...([].concat(beforeChange))
    ].filter(Boolean);

    let [outerParcel, parcelStateControl] = useParcelState({
        value,
        updateValue,
        rebase,
        onChange: onSubmit && asyncChange(onSubmit),
        onChangeUseResult: onSubmitUseResult
    });

    let [innerParcel, parcelBufferControl] = useParcelBuffer({
        parcel: outerParcel,
        buffer,
        debounce,
        beforeChange
    });

    let control = {
        ...parcelStateControl,
        ...parcelBufferControl
    };

    if(control.changeStatus) {
        control.submitStatus = control.changeStatus;
        delete control.changeStatus;
    }

    return [innerParcel, control];
};
