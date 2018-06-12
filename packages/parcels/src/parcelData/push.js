// @flow
import type {PartialParcelData} from '../types/Types';
import updateChildKeys from './updateChildKeys';

import push from 'unmutable/lib/push';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default ({value}: PartialParcelData): Function => {
    return pipe(
        update('value', push(value)),
        update('child', push({})),
        updateChildKeys()
    );
};
