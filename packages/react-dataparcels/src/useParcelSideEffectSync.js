// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';

import Parcel from 'dataparcels';

type Params = {
    parcel: Parcel,
    onSideEffect: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onSideEffectUseResult: boolean
};

type Return = [Parcel, ?any];

export default (params: Params): Return => {

    let handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {
        let result: any = params.onSideEffect(newParcel, changeRequest);

        if(params.onSideEffectUseResult) {
            let [/*parcel*/, changeRequestWithResult] = newParcel._changeAndReturn(
                newParcel => newParcel.set(result)
            );
            changeRequestWithResult._originId = changeRequest._originId;
            changeRequestWithResult._originPath = changeRequest._originPath;
            changeRequest = changeRequestWithResult;
        }
        params.parcel.dispatch(changeRequest);
    };

    let parcelWithSideEffect: Parcel = params.parcel._boundarySplit(handleChange);
    return [parcelWithSideEffect, undefined];
};
