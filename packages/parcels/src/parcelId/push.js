// @flow

import concat from 'unmutable/lib/concat';
import pipeWith from 'unmutable/lib/util/pipeWith';
import toArray from './toArray';
import toString from './toString';

export default (item: string|string[]) => (id: string|string[]): string => {
    return pipeWith(
        id,
        toArray(),
        concat(item),
        ii => typeof id === "string" ? toString()(ii) : ii
    );
};
