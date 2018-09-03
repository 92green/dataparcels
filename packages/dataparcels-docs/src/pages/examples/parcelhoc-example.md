import ParcelHocExample from 'examples/ParcelHocExample';

This example demonstrates a simple usage of `ParcelHoc`.

<ParcelHocExample />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    initialValue: () => "word"
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <input type="text" {...wordParcel.spreadDOM()} />;
};

export default WordParcelHoc(WordEditor);
```

### What's going on

* When `ParcelHoc` mounts, it calls `initialValue` and puts the result ("word") into its Parcel.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelHoc`s state.
