import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function NumberEditor(props) {

    let [numberParcel] = useParcelState({
        value: 123
    });

    let numberParcelAsString = numberParcel
        .modifyUp(string => Number(string))
        .modifyDown(number => `${number}`)

    // ^ turn value into a string on the way down
    // and turn value back into a number on the way up

    // *the keepValue prop is necessary here, see note above

    return exampleFrame({numberParcel}, <ParcelBoundary parcel={numberParcelAsString} keepValue>
        {(parcel) => <input type="text" {...parcel.spreadInput()} />}
    </ParcelBoundary>);
}
