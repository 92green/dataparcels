// @flow

import type Parcel from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';

type Params = {
    keepValue?: boolean,
    parcel: Parcel
};

const NO_KEEP_VALUE = Symbol('NO_KEEP_VALUE');

export default ({keepValue, parcel}: Params): boolean => {
    let keepValueReceivedRef = useRef(NO_KEEP_VALUE);

    if(!keepValue) {
        keepValueReceivedRef.current = NO_KEEP_VALUE;
        return false;
    }


    let changedBySelf = parcel._lastOriginId.startsWith(parcel.id);
    //console.log("--");
    //console.log("parcel._lastOriginId", parcel._lastOriginId);
    //console.log("parcel.id", parcel.id);
    //console.log("changedBySelf", changedBySelf);
    if(changedBySelf) {
        keepValueReceivedRef.current = parcel.value;
        return true;
    }

    let valueIsSameAsLastChangeBySelf = Object.is(
        parcel.value,
        keepValueReceivedRef.current
    );

    //console.log("value", parcel.value);
    //console.log("keepValueReceivedRef.current", keepValueReceivedRef.current);
    //console.log("valueIsSameAsLastChangeBySelf", valueIsSameAsLastChangeBySelf);

    if(!valueIsSameAsLastChangeBySelf) {
        keepValueReceivedRef.current = parcel.value;
    }

    return valueIsSameAsLastChangeBySelf;
};
