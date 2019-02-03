import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import cancel from 'react-dataparcels/cancel';
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

    return <ParcelBoundary parcel={alphanumericParcel}>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
};

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyDown(number => `${number}`) // turn value into a string on the way down
        .modifyUp(string => {
            let number = Number(string);
            return isNaN(number) ? cancel() : number;
        });
        // turn value back into a number on the way up
        // but cancel the change if the string could not be turned into a number

    return <ParcelBoundary parcel={numberParcel}>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
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
        <AlphanumericInput alphanumericParcel={exampleParcel.get('alphanumeric')} />

        <h4>Number > string</h4>
        <p>re-parses valid changes (00000.1 > 0.1 instantly)</p>
        <NumberInput numberParcel={exampleParcel.get('number')} />

        <h4>Delimited string > array of strings</h4>
        <DelimitedStringInput delimitedStringParcel={exampleParcel.get('delimitedString')} />

        <h4>Missing objects</h4>
    </div>;
};

export default ExampleParcelHoc(ExampleHoc(ExampleEditor));
