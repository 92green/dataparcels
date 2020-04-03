// @flow
import type {ParcelValueUpdater} from 'dataparcels';

import Parcel from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

const noop = () => {};

type Params = {
    source?: ParcelValueUpdater
};

export default (params: Params): Parcel => {
    let {
        source = noop
    } = params;

    let [parcel, setParcel] = useState(() => {
        let parcel = new Parcel({
            handleChange: (parcel: Parcel) => {
                setParcel(parcel);
            }
        });

        return parcel._changeAndReturn(
            parcel => parcel
                .modifyUp(source)
                .set(undefined)
        )[0];
    });

    return parcel;
};
