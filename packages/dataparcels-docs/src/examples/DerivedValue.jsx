import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (/* props */) => ({
        word: "blueberries",
        uppercase: undefined
    }),
    modifyBeforeUpdate: [
        (value) => ({
            word: value.word,
            uppercase: value.word.toUpperCase()
        })
    ]
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM()} />
            </div>}
        </ParcelBoundary>
        <p>Uppercase word is {wordParcel.get('uppercase').value}</p>
    </div>;
};

export default WordParcelHoc(ExampleHoc(WordEditor));
