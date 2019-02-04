// @flow
import type {ParcelData} from '../types/Types';

export default (newMeta: *) => ({meta = {}, ...rest}: ParcelData): ParcelData => ({ /* eslint-disable-line no-unused-vars */
    ...rest,
    meta: {
        ...newMeta,
        ...meta
    }
});
