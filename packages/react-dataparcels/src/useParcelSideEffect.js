// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import Parcel from 'dataparcels';
import ApplyBeforeChange from './util/ApplyBeforeChange';

type Params = {
    parcel: Parcel,
    onChange?: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onChangeUseResult?: boolean,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[]
};

type Return = [Parcel];

export default (params: Params): Return => {

    const applyBeforeChange = ApplyBeforeChange(params.beforeChange);

    // outerParcel is locked to changes in props
    const [outerParcel, setOuterParcel] = useState(null);
    // innerParcel is a modified parcel derived from outerParcel
    const [innerParcel, setInnerParcel] = useState(null);

    let handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {
        params.parcel.dispatch(changeRequest);
    };

    let newInnerParcel;
    if(params.parcel !== outerParcel) {

        newInnerParcel = params.parcel
            ._boundarySplit({handleChange})
            .pipe(applyBeforeChange);

        setOuterParcel(params.parcel);
        setInnerParcel(newInnerParcel);
    }

    let returnedParcel: Parcel = innerParcel || newInnerParcel;

    //
    // return
    //

    return [returnedParcel];
};
