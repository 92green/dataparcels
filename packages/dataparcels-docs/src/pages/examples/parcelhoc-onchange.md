import Link from 'gatsby-link';
import ParcelHocExampleOnChange from 'examples/ParcelHocExampleOnChange';

This example demonstrates a `ParcelHoc` with an initial value that originates from props, and a `onChange` function that logs out each change to the console.

`ParcelHoc.onChange` is often used to relay changes further up the React DOM heirarchy. This works in a very similar way to [uncontrolled components in React](https://reactjs.org/docs/uncontrolled-components.html), in that **the component holds the state and is the source of truth**. The components above that make use of the `onChange` props are can merely respond to those changes.

<Link to="/api/ParcelHoc#onChange">API reference for ParcelHoc.onChange</Link>

<ParcelHocExampleOnChange />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (props) => props.defaultValue,
    onChange: (props) => (value) => props.onChange(value)
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
* When `ParcelHoc` mounts, it calls `valueFromProps` and puts the result ("word") into its Parcel.

  From this point forward, ParcelHoc is the source of truth. If `defaultValue` were to change, it would have no effect on `ParcelHoc` or the Parcel's value.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelHoc`s state.
* Additionally **onChange is called each time the Parcel's value changes**. In this example `onChange` then calls `props.onChange`, which logs out the new value to the console.
