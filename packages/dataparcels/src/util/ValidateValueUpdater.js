// @flow
import isParentValue from '../parcelData/isParentValue';
import {UnsafeValueUpdaterError} from '../errors/Errors';

import equals from 'unmutable/lib/equals';

export default (value: any, updatedValue: any) => {
    if(isParentValue(value) && isParentValue(updatedValue) && !equals(value)(updatedValue)) {
        throw UnsafeValueUpdaterError();
    }
};
