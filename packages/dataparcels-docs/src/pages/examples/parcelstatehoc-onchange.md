import ParcelStateHocExampleOnChange from 'examples/ParcelStateHocExampleOnChange';

This example demonstrates a `ParcelStateHoc` with an initial value that originates from props, and a `onChange` function that logs out each change to the console.

`ParcelStateHoc.onChange` is often used to relay changes further up the React DOM heirarchy. This works in a very similar way to [uncontrolled components in React](https://reactjs.org/docs/uncontrolled-components.html), in that **the component holds the state and is the source of truth**. The components above that make use of the `onChange` props are can merely respond to those changes.

<ParcelStateHocExampleOnChange />

```js
import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelStateHoc({
    initialValue: (props) => props.defaultValue,
    onChange: (props) => (parcel) => props.onChange(parcel.value),
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(WordEditor);

export default (/* props */) => {
    let onChange = (value) => console.log(value);
    return <WordExample defaultValue="word" onChange={onChange} />;
};

```

### What's going on

* `WordExample` passes down an initial `word` prop.
* When `ParcelStateHoc` mounts, it calls `initialValue` and puts the result ("word") into its Parcel.

  From this point forward, ParcelStateHoc is the source of truth. If `defaultValue` were to change, it would have no effect on `ParcelStateHoc` or the Parcel's value. It works in a very similar way to an uncontrolled React input.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelStateHoc`s state.
* Additionally **onChange is called each time the Parcel's value changes**. In this example `onChange` then calls `props.onChange`, which logs out the new value to the console.
