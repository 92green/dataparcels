import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (props) => props.initialWord
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(ExampleHoc(WordEditor));

export default (/* props */) => {
    return <WordExample initialWord="word" />;
};
