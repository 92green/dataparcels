// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';

import pop from 'unmutable/lib/pop';

export default () => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return {
        ...rest,
        value: pop()(value),
        child: pop()(child)
    };
};
