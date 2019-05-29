import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function WordEditor(props) {

    let [wordParcel] = useParcelState({
        value: {
            word: "blueberries",
            wordLength: undefined
        },
        beforeChange: (value) => ({
            word: value.word,
            wordLength: value.word.length
        })
    });

    return exampleFrame({wordParcel}, <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>word length is {wordParcel.get('wordLength').value}</p>
    </div>);
}
