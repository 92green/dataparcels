import EditingObjects from 'examples/EditingObjects';

Say we want to allow the user to edit the two fields in the following data structure:

```js
{
    firstname: "Robert",
    lastname: "Clamps"
}
```

This example demonstrates a pretty typical React setup to do that.

<EditingObjects />

```js
import React from 'react';
import {ParcelStateHoc, PureParcel} from 'react-dataparcels';

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

const PersonParcelHoc = ParcelStateHoc({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    }),
    prop: "personParcel"
});

export default PersonParcelHoc(PersonEditor);

```

### What's going on

* `react-dataparcels` is imported.
* It stores the data in a `ParcelStateHoc` higher order component, which passes a parcel down as props.
* The `.get()` method is used on the parcel to create smaller parcels containing just `firstname` and `lastname`.
* It uses the `PureParcel` React component to avoid needless re-rendering. This isn't *required*, but it is very recommended.
* Finally `.spreadDOM()` is used to provide the `value` and `onChange` props to the `input` elements.

