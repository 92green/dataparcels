// @flow
import type {ParcelData} from '../types/Types';
import type {ParcelValueUpdater} from '../types/Types';
import type ChangeRequest from '../change/ChangeRequest';

import setValue from './setValue';
import shouldDangerouslyUpdateParcelData from './shouldDangerouslyUpdateParcelData';
import ValidateValueUpdater from '../util/ValidateValueUpdater';

export default (updater: ParcelValueUpdater): Function => {
    return shouldDangerouslyUpdateParcelData(updater)
        ? updater
        : (parcelData: ParcelData, changeRequest: ?ChangeRequest): ParcelData => {
            let {value} = parcelData;
            let updatedValue = updater(value, changeRequest);
            ValidateValueUpdater(value, updatedValue);
            return setValue(updatedValue)(parcelData);
        };
};
