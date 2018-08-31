// @flow
import type {ParcelData} from '../types/Types';

import del from 'unmutable/lib/delete';

export default (value: *, keepChild: boolean) => (parcelData: ParcelData): ParcelData => {
    let result = {
        ...parcelData,
        value
    };
    return keepChild ? result : del('child')(result);
};
