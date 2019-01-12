// @flow
import ParcelTypes from '../parcel/ParcelTypes';
import {UnsafeValueUpdaterError} from '../errors/Errors';

import equals from 'unmutable/lib/equals';

export default (value: any, updatedValue: any) => {
    let type = new ParcelTypes(value);
    let updatedType = new ParcelTypes(updatedValue);
    if(type.isParent() && updatedType.isParent() && !equals(value)(updatedValue)) {
        throw UnsafeValueUpdaterError();
    }
};
