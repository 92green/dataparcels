// @flow
import type Parcel from './Parcel';

import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (parcelType: string|boolean, methodCreator: Function) => (parcel: Parcel): Object => {
    let methods: Object = methodCreator(parcel);

    // $FlowFixMe - I want to do this
    if(typeof parcelType === "boolean" || parcel[`is${parcelType}`]()) {
        return methods;
    }

    return pipeWith(
        methods,
        map((value, key) => () => {
            // $FlowFixMe - It's ok to throw a boolean (which'll never get here anyway) into a template string
            throw new Error(`Cannot call .${key}() on Parcel with path [${parcel.path().join(', ')}]. Expected a ${parcelType}Parcel, but got a Parcel with a value of "${parcel.value()}"`);
        })
    );
};