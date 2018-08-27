import ParcelStateHocExample from 'examples/ParcelStateHocExample';

This example demonstrates a simple usage of `ParcelStateHoc`.

<ParcelStateHocExample />

```js
import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelStateHoc({
    initialValue: () => "word",
    prop: "wordParcel"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

export default WordParcelHoc(WordEditor);
```

### What's going on

* When `ParcelStateHoc` mounts, it calls `initialValue` and puts the result ("word") into its Parcel.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelStateHoc`s state.
