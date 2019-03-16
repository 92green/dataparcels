// @flow
import type {ParcelData} from '../types/Types';

import update from './update';
import keyArray from 'unmutable/keyArray';
import pipeWith from 'unmutable/pipeWith';

export default (mapper: Function) => (parcelData: ParcelData): ParcelData => {
    let keys = keyArray()(parcelData.value);
    return pipeWith(
        parcelData,
        ...keys.map((key) => update(
            key,
            (childParcelData) => mapper(childParcelData, key, parcelData)
        ))
    );
};
