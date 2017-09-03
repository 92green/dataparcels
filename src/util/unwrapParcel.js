// @flow
import Parcel from '../Parcel';

export default function unwrapParcel(item: *): * {
    return typeof item == "object" && item instanceof Parcel
        ? item.value()
        : item;
}
