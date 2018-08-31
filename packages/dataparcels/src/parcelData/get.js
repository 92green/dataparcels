// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {Property} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import keyOrIndexToKey from './keyOrIndexToKey';
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, notFoundValue: ?*) => (parcelData: ParcelData): ParcelData => {

    let property: ?Property = keyOrIndexToProperty(key)(parcelData);
    let stringKey: Key = keyOrIndexToKey(key)(parcelData);

    return {
        value: getIn(['value', property], notFoundValue)(parcelData),
        ...pipeWith(
            parcelData,
            getIn(['child', property], {key: stringKey})
        )
    };
};
