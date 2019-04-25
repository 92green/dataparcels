import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';
import exampleFrame from 'component/exampleFrame';

const setWordLengthMeta = shape(parcelShape => parcelShape.setMeta({
    wordLength: parcelShape.value.word.length
}));

export default function WordEditor(props) {

    let [wordParcel] = useParcelState({
        value: {
            word: "blueberries",
            wordLength: undefined
        },
        modifyBeforeUpdate: setWordLengthMeta
    });

    return exampleFrame({wordParcel}, <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>word length is {wordParcel.meta.wordLength}</p>
    </div>);
}
