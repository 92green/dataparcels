import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const AlphanumericParcelHoc = ParcelHoc({
    name: "alphanumericParcel",
    valueFromProps: (/* props */) => "Abc123"
});

const AlphanumericInput = (props) => {
    return <ParcelBoundary parcel={props.alphanumericParcel}>
        {(alphanumericParcel) => {
            let parcel = alphanumericParcel.modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
            // ^ remove non alpha numeric characters on the way up
            return <input type="text" {...parcel.spreadDOM()} />;
        }}
    </ParcelBoundary>;
};

const AlphanumericEditor = (props) => {
    let {alphanumericParcel} = props;
    return <div>
        <h4>Alphanumeric input</h4>
        <p>Disallows all non-alphanumeric characters. Try typing some punctuation.</p>
        <AlphanumericInput alphanumericParcel={alphanumericParcel} />
    </div>;
};

export default AlphanumericParcelHoc(ExampleHoc(AlphanumericEditor));
