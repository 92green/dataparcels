// @flow
import type ChangeRequest from '../change/ChangeRequest';
import cancel from '../change/cancel';

export default (updater: Function, parcelData: any, changeRequest: ?ChangeRequest): any => {
    let nextData = updater({...parcelData, changeRequest}) || {};
    if(nextData === cancel || nextData.value === cancel) {
        throw new Error('CANCEL');
    }

    return {
        ...parcelData,
        ...nextData,
        meta: {
            ...parcelData.meta,
            ...(nextData.meta || {})
        }
    };
};
