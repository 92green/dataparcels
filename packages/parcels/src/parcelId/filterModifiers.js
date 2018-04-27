// @flow

import filterNot from 'unmutable/lib/filterNot';
import pipeWith from 'unmutable/lib/util/pipeWith';
import toArray from './toArray';
import toString from './toString';
import isModifier from './isModifier';

export default () => <T: string|string[]>(id: T): T => {
    return pipeWith(
        id,
        toArray(),
        filterNot(isModifier()),
        ii => typeof id === "string" ? toString()(ii) : ii
    );
};