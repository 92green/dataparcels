// @flow
import isValueObject from 'unmutable/lib/util/isValueObject';

export default (value: *): boolean => {
    return isValueObject(value);
};
