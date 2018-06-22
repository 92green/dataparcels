// @flow
import type {ParcelData} from '../types/Types';

import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import pipeWith from 'unmutable/lib/util/pipeWith';

export default () => (parcelData: ParcelData): ParcelData => {
    if(parcelData.child) {
        return parcelData;
    }
    return pipeWith(
        parcelData,
        updateChild(),
        updateChildKeys()
    );
};
