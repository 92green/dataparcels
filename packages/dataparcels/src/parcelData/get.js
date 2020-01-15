// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {Property} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import keyOrIndexToKey from './keyOrIndexToKey';
import setSelf from './setSelf';
import update from './update';
import getIn from 'unmutable/lib/getIn';

export default (key: Key|Index, notFoundValue: any) => (parcelData: ParcelData): ParcelData => {

    let property: ?Property = keyOrIndexToProperty(key)(parcelData);
    let stringKey: ?Key = keyOrIndexToKey(key)(parcelData);

    if(stringKey === undefined) {
        parcelData = update(key, setSelf(notFoundValue))(parcelData);
    }

    return {
        value: getIn(['value', property], notFoundValue)(parcelData),
        ...getIn(['child', property], {key: stringKey})(parcelData)
    };
};
