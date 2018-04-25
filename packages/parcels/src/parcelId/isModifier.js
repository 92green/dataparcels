// @flow

import {MODIFIER_MARK} from './config';
export default () => (idPart: string): boolean => idPart[0] === MODIFIER_MARK;
