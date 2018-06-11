// @flow
import pop from 'unmutable/lib/pop';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (): Function => {
    let fn = pop();
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
