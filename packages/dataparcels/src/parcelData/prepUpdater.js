// @flow
import type {ParcelData} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type ChangeRequest from '../change/ChangeRequest';

import setValue from './setValue';

const validateValueUpdater = process.env.NODE_ENV === 'production'
    ? (value, updatedValue) => {} /* eslint-disable-line no-unused-vars */
    : require('../util/ValidateValueUpdater').default;

export default (updater: ParcelValueUpdater): Function => {
    return updater._asRaw
        ? updater
        : (parcelData: ParcelData, changeRequest: ?ChangeRequest): ParcelData => {
            let {value} = parcelData;
            let updatedValue = updater(value, changeRequest);
            validateValueUpdater(value, updatedValue);
            return setValue(updatedValue)(parcelData);
        };
};
