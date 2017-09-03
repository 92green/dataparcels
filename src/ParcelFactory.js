// @flow
import {Wrap} from 'unmutable';
import Parcel from './Parcel';
import sanitiseParcelData from './util/sanitiseParcelData';

var ListParcel = require('./ListParcel').default;

export default function ParcelFactory(parcelData: ParcelData, handleChange: Function): ParcelType {
    parcelData = sanitiseParcelData(parcelData);
    if(Wrap(parcelData.value).isIndexed()) {
        return new ListParcel(parcelData, handleChange);
    }
    return new Parcel(parcelData, handleChange);
}
