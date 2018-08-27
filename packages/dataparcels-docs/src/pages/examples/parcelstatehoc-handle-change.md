import ParcelStateHocExampleHandleChange from 'examples/ParcelStateHocExampleHandleChange';

This example demonstrates a `ParcelStateHoc` with an initial value that originates from props, and a `handleChange` function that logs out each change to the console.

`handleChange` is often used to relay changes further up the React DOM heirarchy. This is similar to an uncontrolled input in React.

<ParcelStateHocExampleHandleChange />

```js
import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelStateHoc({
    initialValue: (props) => props.initialWord,
    handleChange: (props) => (parcel) => props.onChange(parcel.value),
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(WordEditor);

export default (/* props */) => {
    let onChange = (value) => console.log(value);
    return <WordExample initialWord="word" onChange={onChange} />;
};

```

### What's going on

* `WordExample` passes down an initial `word` prop.
* When `ParcelStateHoc` mounts, it calls `initialValue` and puts the result ("word") into its Parcel.

  From this point forward, ParcelStateHoc is the source of truth. If `initialWord` were to change, it would have no effect on `ParcelStateHoc` or the Parcel's value. It works in a very similar way to an uncontrolled React input.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelStateHoc`s state.
* Additionally **handleChange is called each time the Parcel's value changes**. In this example `handleChange` then calls `props.onChange`, which logs out the new value to the console.
