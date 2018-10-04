// @flow
import type {ParcelData} from '../types/Types';
import prepareChildKeys from './prepareChildKeys';
import updateChildKeys from './updateChildKeys';

import push from 'unmutable/lib/push';

export default (newValue: *) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return updateChildKeys()({
        ...rest,
        value: push(newValue)(value),
        child: push({})(child)
    });
};
