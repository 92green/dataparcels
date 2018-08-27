import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelStateHoc({
    initialValue: () => "word",
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

export default WordParcelHoc(ExampleHoc(WordEditor));
