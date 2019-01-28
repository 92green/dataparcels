import Link from 'component/Link';
import {Link as HtmlLink} from 'dcme-style';
import ParcelMetaConfirmingDeletions from 'examples/ParcelMetaConfirmingDeletions';
import ParcelMetaChangedValues from 'examples/ParcelMetaChangedValues';

# Parcel Meta

Parcel meta provides the ability to store extra data that pertains to parts of a data shape, such as validation error messages against each of the fields in a form. Each location (unique key path) in a Parcel's value has a corresponding meta object, which defaults to an empty object.

```js
let value = {
    abc: 123,
    def: {
        ghi: 456
    }
};

let parcel = new Parcel({value});

// the value above has four locations where meta can be stored:
parcel.meta // returns the meta data object on the top level parcel
parcel.get('abc').meta // returns the meta data object at ['abc']
parcel.get('def').meta // returns the meta data object at ['def']
parcel.get('def').get('ghi').meta // returns the meta data object at ['def', 'ghi']
```

There are three main ways to interact with meta on a Parcel:
* The [meta](/api/Parcel#meta) property
* The [setMeta()](/api/Parcel#setMeta) method
* The [initialMeta()](/api/Parcel#initialMeta) method

Meta is set using a Parcel's [setMeta()](/api/Parcel#setMeta) method, which triggers a change that sets `meta` at the parcel's location.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel.setMeta({
    abc: 123
});
// ^ this triggers a change that sets the parcel's meta to {abc: 123}

parcel.setMeta({
    def: 456
});
// ^ this triggers a change that sets the parcel's meta to {abc: 123, def: 456}
```

The [initialMeta()](/api/Parcel#initialMeta) method can also be used to set the initial meta object.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel
    .initialMeta({
        abc: 123
    })
    .meta // this returns {abc: 123} initially, but this can change after subsequent calls to setMeta()
```

# Examples

Here are some examples of how meta can be useful.

## Confirming deletions

This example shows how to uses meta stored against each element in an array to show a confirmation message with options.

<ParcelMetaConfirmingDeletions />

```js
import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';
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
                    {parcel.meta.confirming
                        ? <span>Are you sure?
                            <button onClick={() => parcel.delete()}>yes</button>
                            <button onClick={() => parcel.setMeta({confirming: false})}>no</button>
                        </span>
                        : <button onClick={() => parcel.setMeta({confirming: true})}>x</button>}
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(FruitListEditor);
```

### What's going on
* Clicking on an "x" button sets the `meta.confirming` state to `true`, which renders a choice of two buttons.
* "No" sets `meta.confirming` back to false again, while "Yes" calls [delete()](/api/Parcel#delete) method on the Parcel.
* Notice how the meta always relates to the correct element, even if other elements are deleted.

## Displaying changed values

This example shows how `initialMeta` can be used to store information for later reference.

<ParcelMetaChangedValues />

```js
import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    })
});

const withOriginalMeta = (parcel) => parcel.initialMeta({
    original: parcel.value
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel
        .get('firstname')
        .pipe(withOriginalMeta);

    let lastname = personParcel
        .get('lastname')
        .pipe(withOriginalMeta);

    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={firstname}>
            {(firstname) => <div>
                <input type="text" {...firstname.spreadDOM()} />
                <div>Changed? {firstname.meta.original === firstname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={lastname}>
            {(lastname) => <div>
                <input type="text" {...lastname.spreadDOM()} />
                <div>Changed? {lastname.meta.original === lastname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```

### What's going on
* The `firstname` and `lastname` parcels use the [pipe()](/api/Parcel#pipe) method, which simply passes each parcel through the `withOriginalMeta` function and calls the [initialMeta()](/api/Parcel#initialMeta) function on each of them.
* `initialMeta()` gets the initial value of the parcel and stores it in `meta.original`
* When rendering, `meta.original` is compared against the current `value` to detect changes of the value since the initial render.

## Validation messages on forms

...
