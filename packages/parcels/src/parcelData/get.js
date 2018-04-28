// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import decodeHashKey from './decodeHashKey';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, notSetValue: * = undefined) => (parcelData: ParcelData): ParcelData => {

    if(!parcelData.child) {
        parcelData = pipeWith(
            parcelData,
            updateChild(),
            updateChildKeys()
        );
    }

    key = decodeHashKey(key)(parcelData);

    return {
        value: getIn(['value', key], notSetValue)(parcelData),
        ...getIn(['child', key], {})(parcelData)
    };
};
