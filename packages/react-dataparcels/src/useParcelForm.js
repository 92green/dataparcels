// @flow

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import type Parcel from 'dataparcels';
import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

import useParcelState from './useParcelState';
import useParcelSideEffect from './useParcelSideEffect';
import useParcelBuffer from './useParcelBuffer';

type Params = {
    value: any,
    updateValue?: boolean,
    onChange?: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onChangeUseResult?: boolean,
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
        onChange,
        onChangeUseResult = false,
        buffer = true,
        debounce = 0,
        validation,
        beforeChange = []
    } = params;

    const [validationFn] = useState(() => (validation && validation.length === 0)
        ? validation()
        : undefined
    );

    beforeChange = [
        validationFn || validation,
        ...beforeChange
    ].filter(Boolean);

    let [outerParcel] = useParcelState({
        value,
        updateValue
    });

    let [sideEffectParcel, sideEffectControl] = useParcelSideEffect({
        parcel: outerParcel,
        onChange,
        onChangeUseResult
    });

    let [innerParcel, innerParcelControl] = useParcelBuffer({
        parcel: sideEffectParcel,
        buffer,
        debounce,
        beforeChange
    });

    let control = {
        ...sideEffectControl,
        ...innerParcelControl
    };

    return [innerParcel, control];
};
