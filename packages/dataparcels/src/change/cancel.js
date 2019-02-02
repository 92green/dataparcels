// @flow
import type {ParcelData} from '../types/Types';

const CANCELLED_ACTION_MARKER = Symbol('CANCELLED_ACTION_MARKER');
const CANCELLED_ERROR_MESSAGE = 'CANCELLED_ERROR_MESSAGE';

export default () => CANCELLED_ACTION_MARKER;

export const checkCancellation = (parcelData: ParcelData): ParcelData => {
    if(parcelData.value === CANCELLED_ACTION_MARKER) {
        throw new Error(CANCELLED_ERROR_MESSAGE);
    }
    return parcelData;
};

export const isCancelledError = (e: Error): boolean => {
    return e.message === CANCELLED_ERROR_MESSAGE;
};
