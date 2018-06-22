// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import prepareChildKeys from './prepareChildKeys';

import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index) => (parcelData: ParcelData): Key => {
    if(typeof key === "string") {
        return key;
    }

    return pipeWith(
        parcelData,
        prepareChildKeys(),
        getIn(['child', key, 'key'])
    );
};
