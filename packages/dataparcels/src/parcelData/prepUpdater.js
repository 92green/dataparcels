// @flow
import type {ParcelData} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type ChangeRequest from '../change/ChangeRequest';

import setValue from './setValue';

export default (updater: ParcelValueUpdater): Function => {
    return updater._asRaw
        ? updater
        : (parcelData: ParcelData, changeRequest: ?ChangeRequest): ParcelData => {
            let {value} = parcelData;
            let updatedValue = updater(value, changeRequest);
            return setValue(updatedValue)(parcelData);
        };
};
