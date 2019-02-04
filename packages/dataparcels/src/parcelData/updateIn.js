// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import update from './update';
import composeWith from 'unmutable/lib/composeWith';

export default (keyPath: Array<Key|Index>, updater: Function): ParcelDataEvaluator => {
    if(keyPath.length === 0) {
        return updater;
    }
    return composeWith(
        ...keyPath.map((key: Key|Index) => (next) => update(key, next)),
        updater
    );
};
