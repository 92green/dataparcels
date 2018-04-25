// @flow

import getIn from './getIn';
import setIn from './setIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyPath: Key[], updater: Function) => (parcelData: ParcelData): ParcelData => {
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
