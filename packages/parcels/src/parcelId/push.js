// @flow

import {SEPARATOR} from './config';

export default (item: string) => (id: string): string => {
    return `${id}${SEPARATOR}${item}`;
};
