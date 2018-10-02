import ParcelBoundaryHold from 'examples/ParcelBoundaryHold';

This example demonstrates ParcelBoundary's `hold` feature.

<ParcelBoundaryHold />

```js
import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    initialValue: (/* props */) => "Gregor"
});

const FoodEditor = (props) => {
    let {nameParcel} = props;
    return <div>
        <label>name</label>
        <ParcelBoundary parcel={nameParcel} hold debugBuffer>
            {(nameParcel, {release}) => <div>
                <input type="text" {...nameParcel.spreadDOM()} />
                <button onClick={() => release()}>Submit</button>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default NameParcelHoc(FoodEditor);
```
