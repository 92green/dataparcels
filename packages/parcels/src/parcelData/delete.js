// @flow
import type {Key, Index, ParcelDataEvaluator} from '../types/Types';

import del from 'unmutable/lib/delete';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (key: Key|Index): ParcelDataEvaluator => {
    let fn = del(key);
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
