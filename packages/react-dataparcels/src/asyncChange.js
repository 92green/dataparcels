// @flow
import type Parcel from 'dataparcels';
import type ChangeRequest from 'dataparcels/ChangeRequest';

import useParcelSideEffectAsync from './useParcelSideEffectAsync';

type OnSideEffect = (parcel: Parcel, changeRequest: ChangeRequest) => Promise<any>;

type Params = {
    parcel: Parcel,
    onSideEffectUseResult: boolean
};

type Return = [Parcel, {[key: string]: any}];

export default (onSideEffect: OnSideEffect) => {
    let sideEffectHook = (params: Params): Return => {
        return useParcelSideEffectAsync({
            ...params,
            onSideEffect
        });
    };
    return {sideEffectHook};
};
