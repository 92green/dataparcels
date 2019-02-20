import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';
import ExampleHoc from 'component/ExampleHoc';

// this example uses a shape updater to set meta data
const setWordLengthMeta = shape(parcelShape => {
    let word = parcelShape.value;
    return parcelShape.setMeta({
        wordLength: word.length
    });
});

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (/* props */) => "blueberries",
    modifyBeforeUpdate: [
        setWordLengthMeta
    ]
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM()} />
                <p>length is {parcel.meta.wordLength}</p>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default WordParcelHoc(ExampleHoc(WordEditor));
