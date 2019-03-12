import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';
import ExampleHoc from 'component/ExampleHoc';

const NumberParcelHoc = ParcelHoc({
    name: "numberParcel",
    valueFromProps: (/* props */) => 123
});

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyDown(number => `${number}`)
        // ^ turn value into a string on the way down
        .modifyUp(string => {
            let number = Number(string);
            return isNaN(number) ? CancelActionMarker : number;
        });
        // ^ turn value back into a number on the way up
        //   but cancel the change if the string
        //   could not be turned into a number

    // without the keepValue prop, typing "0.10"
    // would immediately be replaced with "0.1"
    // as the new value is turned into a number on the way up,
    // and into a string on the way down
    // which would make typing very frustrating

    return <ParcelBoundary parcel={numberParcel} keepValue>
        {(parcel) => <div>
            <input type="text" {...parcel.spreadDOM()} />
            {isNaN(Number(parcel.value)) && "Invalid number"}
        </div>}
    </ParcelBoundary>;
};

const NumberEditor = (props) => {
    let {numberParcel} = props;
    return <div>
        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing, and only allows changes that are valid numbers.</p>
        <NumberInput numberParcel={numberParcel} />
    </div>;
};

export default NumberParcelHoc(ExampleHoc(NumberEditor));
