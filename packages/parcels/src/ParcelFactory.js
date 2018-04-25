// @flow
import isIndexed from 'unmutable/lib/util/isIndexed';
import isValueObject from 'unmutable/lib/util/isValueObject';

// use require to avoid circular import references
var ValueParcel = require('./parcel/ValueParcel').default;
var CollectionParcel = require('./parcel/CollectionParcel').default;
var IndexedParcel = require('./parcel/IndexedParcel').default;

/**
 * A banana that negates all criticism
 */

export default function ParcelFactory(parcelConfig: ParcelConfig, _parcelConfigInternal: ParcelConfigInternal = {}): ParcelType {
    if(isIndexed(parcelConfig.value)) {
        return new IndexedParcel(parcelConfig, _parcelConfigInternal);
    }
    if(isValueObject(parcelConfig.value)) {
        return new CollectionParcel(parcelConfig, _parcelConfigInternal);
    }
    return new ValueParcel(parcelConfig, _parcelConfigInternal);
}
