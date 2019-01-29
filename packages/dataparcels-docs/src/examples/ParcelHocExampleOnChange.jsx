import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ExampleHoc from 'component/ExampleHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (props) => props.defaultValue,
    onChange: (props) => (value) => props.onChange(value)
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(ExampleHoc(WordEditor));

export default (/* props */) => {
    let onChange = (value) => console.log(value);
    return <WordExample defaultValue="word" onChange={onChange} />;
};
