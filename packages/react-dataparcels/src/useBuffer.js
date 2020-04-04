// @flow
import Parcel from 'dataparcels';

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';
// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';

import shallowEquals from 'unmutable/lib/shallowEquals';

type Params = {
    source: Parcel
};

export default (params: Params): Parcel => {

    // params

    let {
        source
    } = params;

    // source

    let sourceRef = useRef();
    sourceRef.current = source;

    let [lastSource, setLastSource] = useState(null);
    let [innerParcel, setInnerParcel] = useState(null);

    if(!lastSource || !parcelEqual(lastSource, source)) {
        setLastSource(source);

        let handleChange = (parcel, changeRequest) => {
            sourceRef.current.dispatch(changeRequest);
        };

        innerParcel = source._boundarySplit({handleChange});

        setInnerParcel(innerParcel);
    }

    // return

    return innerParcel;
};

const parcelEqual = (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa = parcelA.data;
    let bb = parcelB.data;
    let isChild = parcelA.isChild && parcelB.isChild;

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta)
        && (!isChild || (parcelA.isFirstChild === parcelB.isFirstChild && parcelA.isLastChild === parcelB.isLastChild));
};

