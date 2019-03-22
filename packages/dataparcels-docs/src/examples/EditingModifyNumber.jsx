import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const NumberParcelHoc = ParcelHoc({
    name: "numberParcel",
    valueFromProps: (/* props */) => 123
});

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyUp(string => Number(string))
        .modifyDown(number => `${number}`)

    // ^ turn value into a string on the way down
    // and turn value back into a number on the way up

    // without the keepValue prop, typing "0.10"
    // would immediately be replaced with "0.1"
    // as the new value is turned into a number on the way up,
    // and into a string on the way down
    // which would make typing very frustrating

    return <ParcelBoundary parcel={numberParcel} keepValue>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
};

const NumberEditor = (props) => {
    let {numberParcel} = props;
    return <div>
        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing.</p>
        <NumberInput numberParcel={numberParcel} />
    </div>;
};

export default NumberParcelHoc(ExampleHoc(NumberEditor));
