// @flow
import type {ParcelData} from '../types/Types';

export default (value: *) => ({child, ...rest}: ParcelData): ParcelData => ({ /* eslint-disable-line no-unused-vars */
    ...rest,
    value
});
