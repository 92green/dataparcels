// @flow

import del from 'unmutable/lib/delete';
import first from 'unmutable/lib/first';
import get from 'unmutable/lib/get';
import method from 'unmutable/lib/method';
import pipe from 'unmutable/lib/util/pipe';

export default pipe(
    get('actions'),
    first(),
    method('toJS')(),
    del('keyPathModifiers'),
    del('steps')
);
