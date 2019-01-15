// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';
import updateChildKeys from './updateChildKeys';

import push from 'unmutable/lib/push';

export default (...newValues: Array<*>) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    let emptyChildren = newValues.map(() => ({}));

    return updateChildKeys()({
        ...rest,
        value: push(...newValues)(value),
        child: push(...emptyChildren)(child)
    });
};
