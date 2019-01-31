import Link from 'component/Link';
import {Link as HtmlLink} from 'dcme-style';
import ModifyDownUp from 'examples/ModifyDownUp';

# Modifiers and Updaters

## modifyDown() and modifyUp()

The modify methods are particularly useful when your Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. The `modifyDown()` and `modifyUp()` methods are often used with one another to make a value editable on the way down, and turn it back on the way up.

This example shows how a string can be turned into an array for the editor, and during changes the array can be turned back into a string.

<ModifyDownUp />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const PathParcelHoc = ParcelHoc({
    name: "pathParcel",
    valueFromProps: (/* props */) => "abc.def"
});

const PathEditor = (props) => {
    let pathArrayParcel = props
        .pathParcel
        .modifyDown(string => string.split(".")) // turn value into an array on the way down
        .modifyUp(array => array.join(".")); // turn value back into a string on the way up

    return <div>
        {pathArrayParcel.toArray((pathSegmentParcel) => {
            return <ParcelBoundary parcel={pathSegmentParcel} key={pathSegmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => pathArrayParcel.push("")}>Add new path segment</button>
    </div>;
};

export default PathParcelHoc(PathEditor);

```
