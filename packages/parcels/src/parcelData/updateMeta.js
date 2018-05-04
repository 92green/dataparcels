// @flow
import type {PartialParcelData} from '../types/Types';

import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default () => (parcelData: PartialParcelData): PartialParcelData => {
    return pipeWith(
        parcelData,
        update('meta', meta => meta || {})
    );
};
