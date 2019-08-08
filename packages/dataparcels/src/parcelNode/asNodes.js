// @flow
import type {ParcelData} from '../types/Types';

import asRaw from '../parcelData/asRaw';
import ParcelNode from './ParcelNode';

export default (updater: Function): Function => {
    let fn = (parcelData: ParcelData): ParcelData => {
        let parcelNode = new ParcelNode();
        parcelNode._parcelData = parcelData;
        return parcelNode.update(updater).data;
    };
    fn._updater = updater;
    return asRaw(fn);
};
