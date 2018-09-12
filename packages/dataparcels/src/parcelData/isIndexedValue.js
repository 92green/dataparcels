// @flow
import isIndexed from 'unmutable/lib/util/isIndexed';

export default (value: *): boolean => {
    return isIndexed(value);
};
