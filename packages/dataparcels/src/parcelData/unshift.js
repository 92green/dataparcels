// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';
import updateChildKeys from './updateChildKeys';

import unshift from 'unmutable/lib/unshift';

export default (...newValues: Array<*>) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    let emptyChildren = newValues.map(() => ({}));

    return updateChildKeys()({
        ...rest,
        value: unshift(...newValues)(value),
        child: unshift(...emptyChildren)(child)
    });
};
