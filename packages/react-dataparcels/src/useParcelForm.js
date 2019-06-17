// @flow

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import type Parcel from 'dataparcels';
import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

import useParcelState from './useParcelState';
import useParcelSideEffect from './useParcelSideEffect';
import useParcelBuffer from './useParcelBuffer';
import ParcelBufferControl from './ParcelBufferControl';

type Params = {
    value: any,
    updateValue?: boolean,
    onChange?: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onChangeUseResult?: boolean,
    buffer?: boolean,
    debounce?: number,
    validation?: ParcelValueUpdater|() => ParcelValueUpdater,
    rekey?: ParcelValueUpdater|() => ParcelValueUpdater,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel, ParcelBufferControl];

export default (params: Params): Return => {

    let {
        value,
        updateValue = false,
        onChange,
        onChangeUseResult = false,
        buffer = true,
        debounce = 0,
        validation,
        rekey,
        beforeChange = []
    } = params;

    const [validationFn] = useState(() => (validation && validation.length === 0)
        ? validation()
        : undefined
    );

    const [rekeyFn] = useState(() => (rekey && rekey.length === 0)
        ? rekey()
        : undefined
    );

    beforeChange = [
        validationFn || validation,
        ...beforeChange
    ].filter(Boolean);

    let [outerParcel] = useParcelState({
        value,
        updateValue,
        rekey: rekeyFn || rekey
    });

    let [sideEffectParcel] = useParcelSideEffect({
        parcel: outerParcel,
        onChange,
        onChangeUseResult,
        rekey: rekeyFn || rekey
    });

    let [innerParcel, innerParcelControl] = useParcelBuffer({
        parcel: sideEffectParcel,
        buffer,
        debounce,
        beforeChange
    });

    return [innerParcel, innerParcelControl];
};
