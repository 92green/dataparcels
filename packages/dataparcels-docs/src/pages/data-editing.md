import Link from 'gatsby-link';
import EditingObjects from 'examples/EditingObjects';
import EditingArrays from 'examples/EditingArrays';
import ModifierMethods from 'examples/ModifierMethods';
import ManagingOwnParcelState from 'examples/ManagingOwnParcelState';

# Data Editing

Data editing is the ability to manipulate data based on user input, in a way that's expressive to code.

The core of dataparcels' flexible data editing capabilities come from its <Link to="/api/Parcel">Parcel</Link> class and methods. It provides methods to let you **traverse data structures** and **bind data to inputs**, so each input is connected to a specific piece of data in the Parcel. Any changes that occur in each input are propagated back to the top level Parcel, which takes care of **merging partial changes** back into the original data structure.

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

EditingObjects />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    })
});

const PersonEditor = (props) => {
    let {personParcel} = props;
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

export default PersonParcelHoc(PersonEditor);

```

### What's going on

* `react-dataparcels` is imported.
* It stores the data in a <Link to="/api/ParcelHoc">ParcelHoc</Link> higher order component, which creates and stores a Parcel in state, and passes it down as props.
* The `.get()` and `getIn()` methods are used on the Parcel to create smaller parcels containing just `firstname`, `lastname` and `postcode` respectively.
* It uses the <Link to="/api/ParcelBoundary">ParcelBoundary</Link> React component to avoid needless re-rendering. This isn't *required*, but it is very recommended.
* Finally `.spreadDOM()` is used to provide the `value` and `onChange` props to the `input` elements.

For the full list of methods you can use to traverse and change Parcels, see <Link to="/api/Parcel#branch_methods">Branch Methods</Link>, <Link to="/api/Parcel#input_binding_methods">Input Binding Methods</Link> and <Link to="/api/Parcel#change_methods">Change Methods</Link> in the Parcel API reference.

## Indexed data types

Dataparcels has a powerful set of methods for manipulating indexed data types, such as arrays. This example demonstrates an editor that allows the user to edit, append to and sort the elements in an array of strings.

Notice how items in the array are given **automatic unique keys**, displayed under each input as `#a`, `#b` ..., which can be used by React to identify each element regardless of how the elements move around.

EditingArrays />

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
                    <span> key {fruitParcel.key}</span>
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

## Modifying data to fit the UI

Sometimes you may hit a situation where a Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. Parcel's <Link to="/api/Parcel#modifyDown">modifyDown()</Link> and <Link to="/api/Parcel#modifyUp">modifyUp()</Link> methods let you change data types and shapes between the top level Parcel and the input bindings.

<ModifierMethods />

## Managing your own Parcel state

If you don't want to use the <Link to="/api/ParcelHoc">ParcelHoc higher order component</Link> and would prefer to manage your Parcel's state yourself, this example deomstrates how.

This example also serves as an indication on how you might use `dataparcels` with something other than React.

ManagingOwnParcelState />

```js
import React from 'react';
import Parcel from 'react-dataparcels';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default class ManagingOwnParcelState extends React.Component {
    constructor(props) {
        super(props);

        let personParcel = new Parcel({
            value: {
                firstname: "Robert",
                lastname: "Clamps"
            },
            handleChange: (personParcel) => this.setState({personParcel})
        });

        this.state = {personParcel};
    }

    render() {
        let {personParcel} = this.state;
        return <div>
            <label>firstname</label>
            <ParcelBoundary parcel={personParcel.get('firstname')}>
                {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
            </ParcelBoundary>

            <label>lastname</label>
            <ParcelBoundary parcel={personParcel.get('lastname')}>
                {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
            </ParcelBoundary>
        </div>;
    }
}

```
