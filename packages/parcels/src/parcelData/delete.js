// @flow
import type {Key} from '../types/Types';

import del from 'unmutable/lib/delete';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (key: Key): Function => {
    let fn = del(key);
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
