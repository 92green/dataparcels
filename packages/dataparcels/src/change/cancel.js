// @flow
import type {ParcelData} from '../types/Types';

const CANCEL = 'CANCEL';
const CANCEL_SYMBOL = Symbol('CANCEL');

export default CANCEL_SYMBOL;

export const checkCancellation = (parcelData: ParcelData): ParcelData => {
    if(parcelData.value === CANCEL_SYMBOL) {
        throw new Error(CANCEL);
    }
    return parcelData;
};

export const isCancelledError = (e: Error): boolean => {
    return e.message === CANCEL;
};
