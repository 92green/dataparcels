import EditingObjects from 'examples/EditingObjects';

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

This example demonstrates a pretty typical React setup to do that.

<EditingObjects />

```js
import React from 'react';
import {ParcelHoc, PureParcel} from 'react-dataparcels';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    })
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let postcode = personParcel.getIn(['address', 'postcode']);

    return <div>
        <label>firstname</label>
        <PureParcel parcel={firstname}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </PureParcel>

        <label>lastname</label>
        <PureParcel parcel={lastname}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </PureParcel>

        <label>postcode</label>
        <PureParcel parcel={postcode}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </PureParcel>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```

### What's going on

* `react-dataparcels` is imported.
* It stores the data in a `ParcelHoc` higher order component, which creates and stores a parcel in state, and passes it down as props.
* The `.get()` method is used on the parcel to create smaller parcels containing just `firstname` and `lastname`.
* It uses the `PureParcel` React component to avoid needless re-rendering. This isn't *required*, but it is very recommended.
* Finally `.spreadDOM()` is used to provide the `value` and `onChange` props to the `input` elements.

