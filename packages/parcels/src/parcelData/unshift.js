// @flow
import type {PartialParcelData} from '../types/Types';

import updateChildKeys from './updateChildKeys';

import unshift from 'unmutable/lib/unshift';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';

export default ({value}: PartialParcelData): Function => {
    return pipe(
        update('value', unshift(value)),
        update('child', unshift({})),
        updateChildKeys()
    );
};
