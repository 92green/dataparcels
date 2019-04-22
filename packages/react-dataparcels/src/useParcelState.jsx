// @flow

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
import Parcel from 'dataparcels';

type Config = {
    value: any
};

type Return = [Parcel];

export default (config: Config): Return => {
    let {
        value
    } = config;

    let [parcel, setParcel] = useState(() => {
        if(typeof value === "function") {
            value = value();
        }

        return new Parcel({
            value,
            handleChange: (parcel: Parcel) => {
                setParcel(parcel);
            }
        });
    });

    return [parcel];
};
