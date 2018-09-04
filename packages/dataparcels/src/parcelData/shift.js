// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';

import shift from 'unmutable/lib/shift';

export default () => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return {
        ...rest,
        value: shift()(value),
        child: shift()(child)
    };
};
