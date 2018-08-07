// @flow
import type {
    Key,
    Index,
    ParcelData,
    Property
} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import keyOrIndexToKey from './keyOrIndexToKey';
import updateMeta from './updateMeta';
import prepareChildKeys from './prepareChildKeys';

import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, notFoundValue: ?*) => (parcelData: ParcelData): ParcelData => {

    parcelData = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelData);
    let stringKey: Key = keyOrIndexToKey(key)(parcelData);

    return updateMeta()({
        value: getIn(['value', property], notFoundValue)(parcelData),
        ...pipeWith(
            parcelData,
            getIn(['child', property], {key: stringKey})
        )
    });
};
