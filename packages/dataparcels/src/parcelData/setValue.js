// @flow
import type {ParcelDataEvaluator} from '../types/Types';

import isParentValue from './isParentValue';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import set from 'unmutable/lib/set';
import pipeIf from 'unmutable/lib/util/pipeIf';
import pipe from 'unmutable/lib/util/pipe';

export default (value: *): ParcelDataEvaluator => pipe(
    set('value', value),
    pipeIf(
        () => isParentValue(value),
        updateChild(),
        updateChildKeys()
    )
);
