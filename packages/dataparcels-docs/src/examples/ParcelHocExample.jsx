import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: () => "word"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

export default WordParcelHoc(ExampleHoc(WordEditor));
