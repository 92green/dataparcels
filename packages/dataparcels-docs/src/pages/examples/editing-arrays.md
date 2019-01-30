import Link from 'gatsby-link';
import EditingArrays from 'examples/EditingArrays';
import EditingArraysFlipMove from 'examples/EditingArraysFlipMove';
import EditingArraysDrag from 'examples/EditingArraysDrag';

Dataparcels has a powerful set of methods for manipulating indexed data types, such as arrays. This example demonstrates an editor that allows the user to edit, append to and sort the elements in an array of strings.

<EditingArrays />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
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
* `ParcelBoundary` is used to ensure great rendering performance.

For the full list of methods you can use on indexed data types, see <Link to="/api/Parcel#indexed_change_methods">Indexed Change Methods</Link> and <Link to="/api/Parcel#element_change_methods">Element Change Methods</Link> in the Parcel API reference.

## Drag and drop with react-dataparcels-drag

Drag and drop is easy using [react-dataparcels-drag](https://www.npmjs.com/package/react-dataparcels-drag), which is a slim wrapper around [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc). Drag items up and fown to change their order.

<EditingArraysDrag />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelDrag from 'react-dataparcels-drag';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const SortableFruitList = ParcelDrag({
    element: (fruitParcel) => <ParcelBoundary parcel={fruitParcel}>
        {(parcel) => <div className="Box-draggable Typography">
            <input type="text" {...parcel.spreadDOM()} />
            <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
            <button onClick={() => parcel.delete()}>x</button>
        </div>}
    </ParcelBoundary>
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <div>
        <SortableFruitList parcel={fruitListParcel} />
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(FruitListEditor);
```

## Animations with react-flip-move

Dataparcels' also plays nicely with [react-flip-move](https://github.com/joshwcomeau/react-flip-move) because of its automatic keying. Add, remove and move items to see.

<EditingArraysFlipMove />

```js
import React from 'react';
import FlipMove from 'react-flip-move';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <FlipMove>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </FlipMove>;
};

const FruitListParcelHoc = ParcelHoc({
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ],
    name: "fruitListParcel"
});

export default FruitListParcelHoc(FruitListEditor);

```
