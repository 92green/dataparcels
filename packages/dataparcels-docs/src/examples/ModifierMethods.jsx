import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
//import shape from 'react-dataparcels/shape';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const ExampleParcelHoc = ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (/* props */) => ({
        alphanumeric: "Abc123",
        delimitedString: "abc.def",
        number: 123
    })
});

const AlphanumericInput = (props) => {
    let alphanumericParcel = props
        .alphanumericParcel
        .modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, "")); // remove non alpha numeric characters on the way up

    return <input type="text" {...alphanumericParcel.spreadDOM()} />;
};

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyDown(string => `${string}`) // turn value into a string on the way down
        //.modifyUp(shape(number => Number(number))); // turn value back into a number on the way up

    return <input type="text" {...numberParcel.spreadDOM()} />;
};

const DelimitedStringInput = (props) => {
    let delimitedStringParcel = props
        .delimitedStringParcel
        .modifyDown(string => string.split(".")) // turn value into an array on the way down
        .modifyUp(array => array.join(".")); // turn value back into a string on the way up

    return <div>
        {delimitedStringParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => delimitedStringParcel.push("")}>Add new path segment</button>
    </div>;
};

const ExampleEditor = (props) => {
    let {exampleParcel} = props;
    return <div>
        <h4>Alphanumeric input</h4>
        <ParcelBoundary parcel={exampleParcel.get('alphanumeric')}>
            {(parcel) => <AlphanumericInput alphanumericParcel={parcel} />}
        </ParcelBoundary>

        <h4>Number > string</h4>
        <ParcelBoundary parcel={exampleParcel.get('number')}>
            {(parcel) => <NumberInput numberParcel={parcel} />}
        </ParcelBoundary>

        <h4>Delimited string > array of strings</h4>
        <p>Error: "Unmutable update() cannot be called with a value of [object Object]", from prepareChildKeys()</p>
        <ParcelBoundary parcel={exampleParcel.get('delimitedString')}>
            {(parcel) => <DelimitedStringInput delimitedStringParcel={parcel} />}
        </ParcelBoundary>
    </div>;
};

export default ExampleParcelHoc(ExampleHoc(ExampleEditor));
