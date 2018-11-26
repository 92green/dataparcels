// @flow
import isValueObject from 'unmutable/lib/util/isValueObject';
import isWriteable from 'unmutable/lib/util/isWriteable';

export default (value: *): boolean => {
    return isValueObject(value) && isWriteable(value);
};
