// @flow

import {MODIFIER_MARK} from './config';

export default (id: string, key: string = ""): string => `${MODIFIER_MARK}${id}${MODIFIER_MARK}${key}`;
