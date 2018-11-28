// @flow

import del from 'unmutable/lib/delete';
import first from 'unmutable/lib/first';
import method from 'unmutable/lib/method';
import pipe from 'unmutable/lib/util/pipe';

export default pipe(
    method('actions')(),
    first(),
    method('toJS')(),
    del('keyPathModifiers')
);
