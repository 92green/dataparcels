// @flow
import type {ParcelData} from '../types/Types';

import {AsNodeReturnNonParcelNodeError} from '../errors/Errors';
import asRaw from '../parcelData/asRaw';
import ParcelNode from './ParcelNode';

export default (updater: Function): Function => {
    let fn = (parcelData: ParcelData): ParcelData => {
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = parcelData;
        let result = updater(parcelNode);
        if(!(result instanceof ParcelNode)) {
            throw AsNodeReturnNonParcelNodeError();
        }
        return result.data;
    };
    fn._updater = updater;
    return asRaw(fn);
};
