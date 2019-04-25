import Link from 'gatsby-link';
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

Beware that most of the examples on these docs assume that React is being used. If you'd like to use `dataparcels` without React it's completely possible to do so; [drop us a line](https://www.github.com/blueflag/dataparcels/issues) if you do as we'd love to know about your use case.

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
import useParcelState from 'react-dataparcels/useParcelState';

// PLEASE DON'T USE THIS CODE
// THIS CODE IS FOR DEMONSTRATION PURPOSES ONLY
// THERE'S A BETTER WAY OF DOING IT BELOW

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        }
    });

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let postcode = personParcel.getIn(['address', 'postcode']);

    return <div>
        <label>firstname</label>
        <input type="text" value={firstname.value} onChange={firstname.onChangeDOM} />

        <label>lastname</label>
        <input type="text" value={lastname.value} onChange={lastname.onChangeDOM} />

        <label>postcode</label>
        <input type="text" value={postcode.value} onChange={postcode.onChangeDOM} />
    </div>;
};
```

### What's going on

* `react-dataparcels` is imported.
* It stores the data in a <Link to="/api/ParcelHoc">ParcelHoc</Link> higher order component, which creates and stores a parcel in state, and passes it down as props. The parcel contains the data.
* The `.get()` method is used to branch off and create smaller parcels containing just `firstname`, `lastname` and `postcode`.
* The `value` and the `onChangeDOM` functions aree given to each of the `input` elements to bind them to the parcel.

Notice how changes to each of the fields are merged into the original data structure for you. Ths example works well, but there are a few improvements to be made.

## Hello World 2

This is the same example with a few improvements added: better rendering performance, and a reduction of repetitive code.

<EditingObjects />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        }
    });

    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <label>postcode</label>
        <ParcelBoundary parcel={personParcel.getIn(['address', 'postcode'])}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};


```

### What's better about it?

* It's now using the <Link to="/api/ParcelBoundary">ParcelBoundary</Link> React component to make sure that inputs are only re-rendered if their values have changed. This isn't *required*, but it is **very** recommended. Without this, all inputs will re-render any time any data changes.
* `.spreadDOM()` is used to provide the `value` and `onChangeDOM` props to the `input` elements more easily.

## More

- Read more about <Link to="/data-editing">data editing</Link>
- <Link to="/api">Browse the API</Link>
