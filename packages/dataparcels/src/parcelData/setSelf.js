// @flow
import type {ParcelDataEvaluator} from '../types/Types';

import setValue from './setValue';

import del from 'unmutable/lib/delete';
import pipe from 'unmutable/lib/util/pipe';

export default (value: *): ParcelDataEvaluator => pipe(
    del('child'),
    setValue(value)
);
