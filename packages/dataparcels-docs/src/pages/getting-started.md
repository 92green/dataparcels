import Link from 'gatsby-link';
import HelloWorld from 'examples/HelloWorld';
import {Grid, GridItem} from 'dcme-style';

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

Say we want to allow the user to edit the two fields in the following data structure:

```js
{
    firstname: "Robert",
    lastname: "Clamps"
}
```

This example demonstrates a pretty typical React setup to do that.

* `react-dataparcels` is imported.
* It stores the data in a `ParcelStateHock` higher order component, which passes a parcel down as props.
* The `.get()` method is used on the parcel to create smaller parcels containing just `firstname` and `lastname`.
* It uses the `PureParcel` React component to avoid needless re-rendering.
* Finally `.spreadDOM()` is used to provide the `value` and `onChange` props to the `input` elements.

```js
import React from 'react';
import {ParcelStateHock, PureParcel} from 'react-dataparcels';

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
    </div>;
};

const PersonParcelHoc = ParcelStateHock({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    }),
    prop: "personParcel"
});

export default PersonParcelHoc(PersonEditor);


```

<HelloWorld />

## More examples

Soon!

