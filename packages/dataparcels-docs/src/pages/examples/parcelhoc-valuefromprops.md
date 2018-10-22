import Link from 'gatsby-link';
import ParcelHocExampleInitialValueFromProps from 'examples/ParcelHocExampleInitialValueFromProps';

This example demonstrates a `ParcelHoc` with an initial value that originates from props.

<Link to="/api/ParcelHoc#valueFromProps">API reference for ParcelHoc.valueFromProps</Link>

<ParcelHocExampleInitialValueFromProps />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (props) => props.initialWord
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

const WordExample = WordParcelHoc(WordEditor);

export default (/* props */) => {
    return <WordExample initialWord="word" />;
};
```

### What's going on

* `WordExample` passes down an initial `word` prop.
* When `ParcelHoc` mounts, it calls `valueFromProps` and puts the result ("word") into its Parcel.

  **From this point forward, ParcelHoc is the source of truth**. If `initialWord` were to change, it would have no effect on `ParcelHoc` or the Parcel's value. This works in a very similar way to [uncontrolled components in React](https://reactjs.org/docs/uncontrolled-components.html).
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelHoc`s state.
