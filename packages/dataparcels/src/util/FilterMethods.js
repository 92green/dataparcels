// @flow
import type Parcel from '../parcel/Parcel';
import type StaticParcel from '../staticParcel/StaticParcel';

import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (parcelType: string, methodCreator: Function) => (parcel: Parcel|StaticParcel, ...args: Array<*>): { [key: string]: Function } => {
    let methods: { [key: string]: Function } = methodCreator(parcel, ...args);

    // $FlowFixMe - I want to do this
    if(parcel[`is${parcelType}`]()) {
        return methods;
    }

    return pipeWith(
        methods,
        map((value, key) => (...args: Array<*>) => {
            // $FlowFixMe - why do you pay attention to your types more than preceding conditional logic?
            let suffix = Array.isArray(parcel.path) ? `(keyPath: [${parcel.path.join(', ')}]).` : ``;

            if(key.slice(-4) === "Self") {
                throw new Error(`.${key.slice(0, -4)}() cannot be called with ${args.length} argument${args.length === 1 ? "" : "s"} on a value of "${parcel.value}". ${suffix}`);
            }
            throw new Error(`.${key}() is not a function. It can only be called on parcels of type "${parcelType}". ${suffix}`);
        })
    );
};
