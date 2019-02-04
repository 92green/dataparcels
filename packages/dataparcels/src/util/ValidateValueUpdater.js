// @flow
import isParentValue from '../parcelData/isParentValue';

import equals from 'unmutable/lib/equals';

export default (value: any, updatedValue: any) => {
    if(process.env.NODE_ENV !== 'production' && isParentValue(value) && isParentValue(updatedValue) && !equals(value)(updatedValue)) {
        console.warn(`Warning: please ensure you do not change the shape of the value, as changing the data shape or moving children within the data shape can cause dataparcels to misplace its keying and meta information!`); /* eslint-disable-line */
    }
};
