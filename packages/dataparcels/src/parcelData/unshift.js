// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';
import updateChildKeys from './updateChildKeys';

import unshift from 'unmutable/lib/unshift';

export default (newValue: *) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return updateChildKeys()({
        ...rest,
        value: unshift(newValue)(value),
        child: unshift({})(child)
    });
};
