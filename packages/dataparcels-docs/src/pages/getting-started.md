import Link from 'gatsby-link';
import {Grid, GridItem} from 'dcme-style';
import EditingObjectsBeginner from 'examples/EditingObjectsBeginner';
import EditingObjects from 'examples/EditingObjects';

# Getting Started

## Installation

If you'd like to use `dataparcels` with React:

```bash
yarn add react-dataparcels # ...or npm install react-dataparcels --save
```

If you'd like to use `dataparcels` *without* React:


```bash
yarn add dataparcels # ...or npm install dataparcels --save
```

Beware that most of the examples on these docs assume that React is being used. If you'd like to use `dataparcels` without React it's completely possible to do so; [drop us a line](https://www.github.com/blueflag/dataparcels/issues) if you do as we'd love ot know about your use case.

## Hello World

Say we want to allow the user to edit the fields in the following data structure:

```js
{
    firstname: "Robert",
    lastname: "Clamps",
    address: {
        postcode: "1234"
    }
}
```

We could do something like this.

<EditingObjectsBeginner />

```js
import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';

const PersonParcelHoc = ParcelStateHoc({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    }),
    prop: "personParcel"
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let address = personParcel.get('address');
    let postcode = address.get('postcode');

    return <div>
        <label>firstname</label>
        <input type="text" value={firstname.value} onChange={firstname.onChange} />

        <label>lastname</label>
        <input type="text" value={lastname.value} onChange={lastname.onChange} />

        <label>postcode</label>
        <input type="text" value={postcode.value} onChange={postcode.onChange} />
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```

### What's going on

* `react-dataparcels` is imported.
* It stores the data in a `ParcelStateHoc` higher order component, which passes a parcel down as props. The parcel contains the data.
* The `.get()` method is used on the parcel to create smaller parcels containing just `firstname`, `lastname` etc.
* The `value` and the `onChange` functions aree given to each of the `input` elements.

Notice how changes to each of the fields are merged into the original data structure for you. But we can do better.

## New And Improved™

This is the same example with a few improvements added: better rendering performance, and a reduction of repetitive code.

<EditingObjects />

```js
import React from 'react';
import {ParcelStateHoc, PureParcel} from 'react-dataparcels';

const PersonParcelHoc = ParcelStateHoc({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    }),
    prop: "personParcel"
});

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <label>firstname</label>
        <PureParcel parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </PureParcel>

        <label>lastname</label>
        <PureParcel parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </PureParcel>

        <label>postcode</label>
        <PureParcel parcel={personParcel.getIn(['address', 'postcode'])}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </PureParcel>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```

### What's changed

* It's now using the `PureParcel` React component to make sure that inputs are only re-rendered if their values have changed. This isn't *required*, but it is **very** recommended. Without this, all inputs will re-render any time any data changes.
* `.spreadDOM()` is used to provide the `value` and `onChange` props to the `input` elements more easily.
* The `.getIn()` method is used on the parcel to create a smaller parcels containing just `postcode`.

## Docs

For more info see the documentation for <Link to="/api/Parcel">Parcel</Link>, <Link to="/api/ParcelStateHoc">ParcelStateHoc</Link> and <Link to="/api/PureParcel">PureParcel</Link>.

## More examples

* <Link to="/examples/editing-arrays">Editing Arrays</Link>
* <Link to="/examples/managing-your-own-parcel-state">Managing Your Own Parcel State</Link>
* <Link to="/examples/parcelstatehoc-example">ParcelStateHoc - Example</Link>
* <Link to="/examples/parcelstatehoc-initial-value-from-props">ParcelStateHoc - Getting initialValue from props</Link>
* <Link to="/examples/parcelstatehoc-onchange">ParcelStateHoc - Using onChange</Link>

