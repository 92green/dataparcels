import Link from 'gatsby-link';
import EditingObjects from 'examples/EditingObjects';
import EditingArrays from 'examples/EditingArrays';
import EditingModify from 'examples/EditingModify';
import ManagingOwnParcelState from 'examples/ManagingOwnParcelState';
import {Divider} from 'dcme-style';
import {Message} from 'dcme-style';

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

<EditingObjects />

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

<Divider />

## Indexed data types

Dataparcels has a powerful set of methods for manipulating indexed data types, such as arrays. This example demonstrates an editor that allows the user to edit, append to and sort the elements in an array of strings.

Notice how items in the array are given **automatic unique keys**, displayed under each input as `#a`, `#b` ..., which can be used by React to identify each element regardless of how the elements move around.

<Message>Make sure you check out the <Link to="ui-behaviour#Drag-and-drop-sorting">drag and drop sorting</Link> example too.</Message>

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

<Divider />

## Modifying data to fit the UI

Sometimes you may hit a situation where a Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. Parcel's <Link to="/api/Parcel#modifyDown">modifyDown()</Link> and <Link to="/api/Parcel#modifyUp">modifyUp()</Link> methods let you change data types and shapes between the top level Parcel and the input bindings.

<EditingModify />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';

const ExampleParcelHoc = ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (/* props */) => ({
        alphanumeric: "Abc123",
        number: 123,
        delimitedString: "abc.def",
        missingValue: undefined,
        edges: [
            {node: "A"},
            {node: "B"}
        ]
    })
});

const AlphanumericInput = (props) => {
    let alphanumericParcel = props
        .alphanumericParcel
        .modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
        // ^ remove non alpha numeric characters on the way up

    return <ParcelBoundary parcel={alphanumericParcel}>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
};

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyDown(number => `${number}`)
        // ^ turn value into a string on the way down
        .modifyUp(string => {
            let number = Number(string);
            return isNaN(number) ? CancelActionMarker : number;
        });
        // ^ turn value back into a number on the way up
        //   but cancel the change if the string
        //   could not be turned into a number

    // without the keepState prop, typing "0.10"
    // would immediately be replaced with "0.1"
    // as the new value is turned into a number on the way up,
    // and into a string on the way down
    // which would make typing very frustrating

    return <ParcelBoundary parcel={numberParcel} keepState>
        {(parcel) => <div>
            <input type="text" {...parcel.spreadDOM()} />
            {isNaN(Number(parcel.value)) && "Invalid number"}
        </div>}
    </ParcelBoundary>;
};

const DelimitedStringInput = (props) => {
    let delimitedStringParcel = props
        .delimitedStringParcel
        .modifyDown(string => string.split("."))
        //  ^ turn value into an array on the way down
        .modifyUp(array => array.join("."));
        // ^ turn value back into a string on the way up

    return <div>
        {delimitedStringParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => delimitedStringParcel.push("")}>Add new path segment</button>
    </div>;
};

const MissingValueInput = (props) => {
    let missingValueParcel = props
        .missingValueParcel
        .modifyDown(value => value || [])
        // ^ turn value into an array if its missing
        //   so we can always render against an array

    return <div>
        {missingValueParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => missingValueParcel.push("")}>Add new element</button>
    </div>;
};

const ExampleEditor = (props) => {
    let {exampleParcel} = props;
    return <div>
        <h4>Alphanumeric input</h4>
        <p>Disallows all non-alphanumeric characters.</p>
        <AlphanumericInput alphanumericParcel={exampleParcel.get('alphanumeric')} />

        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing, and only allows changes that are valid numbers.</p>
        <NumberInput numberParcel={exampleParcel.get('number')} />

        <h4>Delimited string > array of strings</h4>
        <p>Turns a stored string into an array so array editing controls can be rendered.</p>
        <DelimitedStringInput delimitedStringParcel={exampleParcel.get('delimitedString')} />

        <h4>Coping with missing values</h4>
        <p>Prepares values so that editors can remain simple.</p>
        <MissingValueInput missingValueParcel={exampleParcel.get('missingValue')} />
    </div>;
};

export default ExampleParcelHoc(ExampleEditor);

```

<Divider />

## Managing your own Parcel state

If you don't want to use the <Link to="/api/ParcelHoc">ParcelHoc higher order component</Link> and would prefer to manage your Parcel's state yourself, this example demonstrates how.

This example also serves as an indication on how you might use `dataparcels` with something other than React.

<ManagingOwnParcelState />

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
