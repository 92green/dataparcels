// @flow
import isIndexed from 'unmutable/lib/util/isIndexed';
import isWriteable from 'unmutable/lib/util/isWriteable';

export default (value: *): boolean => {
    return isIndexed(value) && isWriteable(value);
};
