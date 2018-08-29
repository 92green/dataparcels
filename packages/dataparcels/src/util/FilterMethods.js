// @flow
import type Parcel from '../parcel/Parcel';

import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (parcelType: string, methodCreator: Function) => (parcel: Parcel, ...args: Array<*>): { [key: string]: Function } => {
    let methods: { [key: string]: Function } = methodCreator(parcel, ...args);

    // $FlowFixMe - I want to do this
    if(parcel[`is${parcelType}`]()) {
        return methods;
    }

    return pipeWith(
        methods,
        map((value, key) => () => {
            throw new Error(`.${key}() is not a function. Parcel at [${parcel.path.join(', ')}] has a value of "${parcel.value}"`);
        })
    );
};
