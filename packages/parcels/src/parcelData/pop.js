// @flow
import type {
    Key
} from '../types/Types';

import pop from 'unmutable/lib/pop';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (key: Key): Function => {
    let fn = pop(key);
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
