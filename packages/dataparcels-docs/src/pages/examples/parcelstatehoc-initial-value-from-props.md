import ParcelStateHocExampleInitialValueFromProps from 'examples/ParcelStateHocExampleInitialValueFromProps';

This example demonstrates a `ParcelStateHoc` with an initial value that originates from props.

<ParcelStateHocExampleInitialValueFromProps />

```js
import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';

const WordParcelHoc = ParcelStateHoc({
    initialValue: (props) => props.initialWord,
    prop: "wordParcel"
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
* When `ParcelStateHoc` mounts, it calls `initialValue` and puts the result ("word") into its Parcel.

  **From this point forward, ParcelStateHoc is the source of truth**. If `initialWord` were to change, it would have no effect on `ParcelStateHoc` or the Parcel's value. It works in a very similar way to an uncontrolled React input.
* `wordParcel` is passed to `WordEditor` for editing. Changes to `wordParcel` are stored in `ParcelStateHoc`s state.
