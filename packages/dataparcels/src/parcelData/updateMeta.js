// @flow
import type {ParcelData} from '../types/Types';

import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default () => (parcelData: ParcelData): ParcelData => {
    return pipeWith(
        parcelData,
        update('meta', meta => meta || {})
    );
};
