// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
import Parcel from 'dataparcels';
import ApplyModifyBeforeUpdate from './util/ApplyModifyBeforeUpdate';

type Config = {
    value: any,
    updateValue?: boolean,
    onChange?: (value: any, changeRequest: ChangeRequest) => void,
    modifyBeforeUpdate?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel];

export default (config: Config): Return => {

    const getValue = typeof config.value === "function" ? config.value : () => config.value;

    // takes a parcel and chains the modifyBeforeUpdate functions off of it
    // placing them each inside .modifyUp()s
    // so that all changes made to the returned parcel
    // go up through all of modifyBeforeUpdate's functions

    const applyModifyBeforeUpdate = ApplyModifyBeforeUpdate(config.modifyBeforeUpdate);

    // takes a parcel and sets the current config.value as its value
    // (config.value is first passed through modifyBeforeUpdate),
    // then passes the resulting parcel through modifyBeforeUpdate
    // so that all changes made to the returned parcel
    // go up through all of modifyBeforeUpdate's functions

    const updateParcelValue = (parcel: Parcel): Parcel => applyModifyBeforeUpdate(
        parcel._changeAndReturn(
            parcel => applyModifyBeforeUpdate(parcel).set(getValue())
        )
    );

    const [parcel, setParcel] = useState(() => updateParcelValue(
        new Parcel({
            handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
                setParcel(applyModifyBeforeUpdate(parcel));
                config.onChange && config.onChange(parcel, changeRequest);
            }
        })
    ));

    const [prevValue, setPrevValue] = useState(() => parcel.value);

    if(config.updateValue) {
        const value = getValue();

        if(!Object.is(value, prevValue)) {
            setPrevValue(value);
            setParcel(updateParcelValue(parcel));
        }
    }

    return [parcel];
};
