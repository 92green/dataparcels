import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelStateHoc({
    initialValue: (props) => props.initialWord,
    handleChange: (props) => (parcel) => props.onChange(parcel.value),
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(ExampleHoc(WordEditor));

export default (/* props */) => {
    let onChange = (value) => console.log(value);
    return <WordExample initialWord="word" onChange={onChange} />;
};
