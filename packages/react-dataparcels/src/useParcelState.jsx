// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
import Parcel from 'dataparcels';

type Config = {
    value: any,
    updateValue?: boolean,
    onChange?: (value: any, changeRequest: ChangeRequest) => void,
    modifyBeforeUpdate?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel];

export default (config: Config): Return => {

    const getValue = typeof config.value === "function" ? config.value : () => config.value;

    const applyModifyBeforeUpdate = (parcel: Parcel): Parcel => {
        return []
            .concat(config.modifyBeforeUpdate || [])
            .reduceRight(
                (parcel, updater) => parcel.modifyUp(updater),
                parcel
            );
    };

    const [parcel, setParcel] = useState(() => applyModifyBeforeUpdate(
        new Parcel({
            value: getValue(),
            handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
                setParcel(parcel);
                config.onChange && config.onChange(parcel, changeRequest);
            }
        })
    ));

    const [prevValue, setPrevValue] = useState(() => parcel.value);

    if(config.updateValue) {
        const value = getValue();

        if(!Object.is(value, prevValue)) {
            setPrevValue(value);
            setParcel(
                parcel._changeAndReturn(
                    parcel => applyModifyBeforeUpdate(parcel).set(getValue())
                )
            );
        }
    }

    return [parcel];
};
