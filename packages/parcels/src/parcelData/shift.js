// @flow
import shift from 'unmutable/lib/shift';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (key: Key): Function => {
    let fn = shift(key);
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
