// @flow
import type {ParcelData} from '../types/Types';

import isParentValue from './isParentValue';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import del from 'unmutable/lib/delete';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (value: *, keepChild: boolean) => (parcelData: ParcelData): ParcelData => {
    let result = {
        ...parcelData,
        value
    };

    result = keepChild ? result : del('child')(result);

    if(!isParentValue(value)) {
        return result;
    }

    return pipeWith(
        result,
        updateChild(),
        updateChildKeys()
    );
};
