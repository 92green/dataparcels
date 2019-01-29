import Link from 'gatsby-link';
import ParcelHocExample from 'examples/ParcelHocExample';

This example demonstrates a simple usage of `ParcelHoc`.

<Link to="/api/ParcelHoc">API reference for ParcelHoc</Link>

<ParcelHocExample />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: () => "word"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

export default WordParcelHoc(WordEditor);
```

### What's going on

* When `ParcelHoc` mounts, it calls `valueFromProps` and puts the result ("word") into its Parcel.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelHoc`s state.
