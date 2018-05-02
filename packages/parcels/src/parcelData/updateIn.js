// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import getIn from './getIn';
import setIn from './setIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyPath: Array<Key|Index>, updater: Function) => (parcelData: ParcelData): ParcelData => {
    return pipeWith(
        parcelData,
        setIn(keyPath, updater(
            pipeWith(
                parcelData,
                getIn(keyPath)
            )
        ))
    );
};
