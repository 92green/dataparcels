import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

function NumberInput(props) {
    let numberParcel = props
        .numberParcel
        .modifyUp(string => Number(string))
        .modifyDown(number => `${number}`)

    // ^ turn value into a string on the way down
    // and turn value back into a number on the way up

    // *the keepValue prop is necessary here, see note below

    return <ParcelBoundary parcel={numberParcel} keepValue>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
}

export default function NumberEditor(props) {

    let [numberParcel] = useParcelState({
        value: 123
    });

    return exampleFrame({numberParcel}, <div>
        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing.</p>
        <NumberInput numberParcel={numberParcel} />
    </div>);
}
