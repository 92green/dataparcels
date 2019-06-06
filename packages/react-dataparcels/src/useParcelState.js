// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
import Parcel from 'dataparcels';
import useDebouncedCallback from 'use-debounce/lib/callback';
import ApplyBeforeChange from './util/ApplyBeforeChange';

type Params = {
    value: any,
    updateValue?: boolean,
    onChange?: (parcel: Parcel, changeRequest: ChangeRequest) => void,
    debounce?: number,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel];

export default (params: Params): Return => {

    const getValue = typeof params.value === "function" ? params.value : () => params.value;

    // takes a parcel and chains the beforeChange functions off of it
    // placing them each inside .modifyUp()s
    // so that all changes made to the returned parcel
    // go up through all of beforeChange's functions

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    //
    // debounce
    //

    const [debouncedOnChange] = useDebouncedCallback(params.onChange, params.debounce);

    // takes a parcel and sets the current params.value as its value
    // (params.value is first passed through beforeChange),
    // then passes the resulting parcel through beforeChange
    // so that all changes made to the returned parcel
    // go up through all of beforeChange's functions

    const updateParcelValue = (parcel: Parcel): Parcel => {

        let [changedParcel] = parcel._changeAndReturn(
            parcel => applyBeforeChange(parcel).set(getValue())
        );

        return applyBeforeChange(changedParcel);
    };

    const [parcel, setParcel] = useState(() => updateParcelValue(
        new Parcel({
            handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
                setParcel(applyBeforeChange(parcel));

                if(params.onChange) {
                    let fn = params.debounce ? debouncedOnChange : params.onChange;
                    fn(parcel, changeRequest);
                }
            }
        })
    ));

    const [prevValue, setPrevValue] = useState(() => parcel.value);

    if(params.updateValue) {
        const value = getValue();

        if(!Object.is(value, prevValue)) {
            setPrevValue(value);
            setParcel(updateParcelValue(parcel));
        }
    }

    return [parcel];
};
