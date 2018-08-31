// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {Property} from '../types/Types';

import prepareChildKeys from './prepareChildKeys';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';
import keyOrIndexToProperty from './keyOrIndexToProperty';

import set from 'unmutable/lib/set';
import size from 'unmutable/lib/size';
import deleteIn from 'unmutable/lib/deleteIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, newValue: *) => (parcelData: ParcelData): ParcelData => {
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelDataWithChildKeys);

    let {value, child, ...rest} = parcelDataWithChildKeys;
    let result = {
        ...rest,
        value: set(property, newValue)(value),
        child: deleteIn([property, 'child'], {})(child)
    };

    if(size()(result.value) > size()(value)) {
        return pipeWith(
            result,
            updateChild(),
            updateChildKeys()
        );
    }

    return result;
};
