import Link from 'gatsby-link';
import EditingArrays from 'examples/EditingArrays';
import EditingArraysFlipMove from 'examples/EditingArraysFlipMove';

Dataparcels has a powerful set of methods for manipulating indexed data types, such as arrays. This example demonstrates an editor that allows the user to edit, append to and sort the elements in an array of strings.

<EditingArrays />

```js
import React from 'react';
import {ParcelHoc, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    initialValue: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <PureParcel parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrevWithSelf()}>^</button>
                    <button onClick={() => parcel.swapNextWithSelf()}>v</button>
                    <button onClick={() => parcel.insertAfterSelf(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.deleteSelf()}>x</button>
                </div>}
            </PureParcel>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(FruitListEditor);
```

### What's going on

* `fruitListParcel` contains an array.
* `Parcel.toArray()` is used to iterate over the Parcel's elements, and it is passed a `mapper` function to return React elements.
* Each element parcel's `key` property is used to uniquely key each React element.
* `PureParcel` is used to ensure great rendering performance.

For the full list of methods you can use on indexed data types, see <Link to="/api/Parcel#indexed_change_methods">Indexed Change Methods</Link> and <Link to="/api/Parcel#element_change_methods">Element Change Methods</Link> in the Parcel API reference.

## With react-flip-move

Dataparcels automatic keying plays nicely with [react-flip-move](https://github.com/joshwcomeau/react-flip-move).

<EditingArraysFlipMove />

```js
import React from 'react';
import FlipMove from 'react-flip-move';
import {ParcelHoc, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <FlipMove>
        {fruitListParcel.toArray((fruitParcel) => {
            return <PureParcel parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrevWithSelf()}>^</button>
                    <button onClick={() => parcel.swapNextWithSelf()}>v</button>
                    <button onClick={() => parcel.insertAfterSelf(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.deleteSelf()}>x</button>
                </div>}
            </PureParcel>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </FlipMove>;
};

const FruitListParcelHoc = ParcelHoc({
    initialValue: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ],
    name: "fruitListParcel"
});

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));

```
