// @flow
import type {ParcelDataEvaluator} from '../types/Types';
import shift from 'unmutable/lib/shift';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default (): ParcelDataEvaluator => {
    let fn = shift();
    return pipe(
        update('value', fn),
        update('child', fn)
    );
};
