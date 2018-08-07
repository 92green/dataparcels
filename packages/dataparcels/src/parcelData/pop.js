// @flow
import type {ParcelDataEvaluator} from '../types/Types';
import pop from 'unmutable/lib/pop';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (): ParcelDataEvaluator => {
    let fn = pop();
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
