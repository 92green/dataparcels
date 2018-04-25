// @flow

import {SEPARATOR} from './config';

export default () => (id: string|string[]): string => {
    return typeof id === "string" ? id : id.join(SEPARATOR);
};
