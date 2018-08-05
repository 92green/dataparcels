// @flow
import type {ParcelData} from '../types/Types';

import parcelGet from './get';
import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (iteratee: Function) => (parcelData: ParcelData) => {
    pipeWith(
        parcelData.value,
        map((ii: *, key: string|number) => {
            iteratee(parcelGet(key)(parcelData), key);
        })
    );
};
