import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelStateHoc({
    initialValue: (props) => props.initialWord,
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(ExampleHoc(WordEditor));

export default (/* props */) => {
    return <WordExample initialWord="word" />;
};
