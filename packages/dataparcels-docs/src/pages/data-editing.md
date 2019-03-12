import Link from 'gatsby-link';
import EditingObjects from 'examples/EditingObjects';
import EditingArrays from 'examples/EditingArrays';
import EditingModifyAlphanumeric from 'examples/EditingModifyAlphanumeric';
import EditingModifyNumber from 'examples/EditingModifyNumber';
import EditingModifyDelimited from 'examples/EditingModifyDelimited';
import EditingModifyMissing from 'examples/EditingModifyMissing';
import DerivedValue from 'examples/DerivedValue';
import DerivedMeta from 'examples/DerivedMeta';
import InteractingFields from 'examples/InteractingFields';
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

<EditingModifyAlphanumeric />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const AlphanumericParcelHoc = ParcelHoc({
    name: "alphanumericParcel",
    valueFromProps: (/* props */) => "Abc123"
});

const AlphanumericInput = (props) => {
    return <ParcelBoundary parcel={props.alphanumericParcel}>
        {(alphanumericParcel) => {
            let parcel = alphanumericParcel.modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
            // ^ remove non alpha numeric characters on the way up
            return <input type="text" {...parcel.spreadDOM()} />;
        }}
    </ParcelBoundary>;
};

const AlphanumericEditor = (props) => {
    let {alphanumericParcel} = props;
    return <div>
        <h4>Alphanumeric input</h4>
        <p>Disallows all non-alphanumeric characters. Try typing some punctuation.</p>
        <AlphanumericInput alphanumericParcel={alphanumericParcel} />
    </div>;
};

export default AlphanumericParcelHoc(AlphanumericEditor);

```

<EditingModifyNumber />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const NumberParcelHoc = ParcelHoc({
    name: "numberParcel",
    valueFromProps: (/* props */) => 123
});

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyUp(string => Number(string))
        .modifyDown(number => `${number}`)

    // ^ turn value into a string on the way down
    // and turn value back into a number on the way up

    // without the keepValue prop, typing "0.10"
    // would immediately be replaced with "0.1"
    // as the new value is turned into a number on the way up,
    // and into a string on the way down
    // which would make typing very frustrating

    return <ParcelBoundary parcel={numberParcel} keepValue>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
};

const NumberEditor = (props) => {
    let {numberParcel} = props;
    return <div>
        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing</p>
        <NumberInput numberParcel={numberParcel} />
    </div>;
};

export default NumberParcelHoc(NumberEditor);
```

<EditingModifyDelimited />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const DelimitedStringParcelHoc = ParcelHoc({
    name: "delimitedParcel",
    valueFromProps: (/* props */) => "abc.def"
});

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

const DelimitedStringEditor = (props) => {
    let {delimitedParcel} = props;
    return <div>
        <h4>Delimited string > array of strings</h4>
        <p>Turns a stored string into an array so array editing controls can be rendered.</p>
        <DelimitedStringInput delimitedStringParcel={delimitedParcel} />
    </div>;
};

export default DelimitedStringParcelHoc(DelimitedStringEditor);
```

<EditingModifyMissing />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const MaybeArrayParcelHoc = ParcelHoc({
    name: "maybeArrayParcel",
    valueFromProps: (/* props */) => undefined
});

const MaybeArrayInput = (props) => {
    let maybeArrayParcel = props
        .maybeArrayParcel
        .modifyDown(value => value || [])
        // ^ turn value into an array if its missing
        //   so we can always render against an array

    return <div>
        {maybeArrayParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => maybeArrayParcel.push("")}>Add new element</button>
    </div>;
};

const MaybeArrayEditor = (props) => {
    let {maybeArrayParcel} = props;
    return <div>
        <h4>Compensating for missing values</h4>
        <p>Prepares values so that editors can remain simple.</p>
        <MaybeArrayInput maybeArrayParcel={maybeArrayParcel} />
    </div>;
};

export default MaybeArrayParcelHoc(MaybeArrayEditor);
```

<Divider />

## Derived data

It's easy to update Parcel data based on other Parcel data using `modifyBeforeUpdate` available on <Link to="/api/ParcelHoc#modifyBeforeUpdate">ParcelHoc</Link>, <Link to="/api/ParcelBoundary#modifyBeforeUpdate">ParcelBoundary</Link> and <Link to="/api/ParcelBoundaryHoc#modifyBeforeUpdate">ParcelBoundaryHoc</Link>.

It works quite like <Link to="/api/Parcel#modifyUp">modifyUp()</Link> as shown in <Link to="/data-editing#Modifying-data-to-fit-the-UI">Modifying data to fit the UI</Link>, but `modifyBeforeUpdate` is also applied to the initial value *and* any updates that occur because of prop changes.

This example derives an uppercase version of the word.

<DerivedValue />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (/* props */) => ({
        word: "blueberries",
        uppercase: undefined
    }),
    modifyBeforeUpdate: [
        (value) => ({
            word: value.word,
            uppercase: value.word.toUpperCase()
        })
    ]
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>Uppercase word is {wordParcel.get('uppercase').value}</p>
    </div>;
};

export default WordParcelHoc(WordEditor);

```

Setting derived data is particularly useful with <Link to="/parcel-meta">Parcel meta</Link>, which provides the ability to store extra data that pertains to parts of a data shape.

This example derives the length of the word, storing it in meta. It also uses a <Link to="/api/ParcelShape">shape updater</Link>.

<DerivedMeta />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';

// this example uses a shape updater to set meta data
const setWordLengthMeta = shape(parcelShape => {
    let word = parcelShape.value;
    return parcelShape.setMeta({
        wordLength: word.length
    });
});

const WordParcelHoc = ParcelHoc({
    name: "wordParcel",
    valueFromProps: (/* props */) => "blueberries",
    modifyBeforeUpdate: [
        setWordLengthMeta
    ]
});

const WordEditor = (props) => {
    let {wordParcel} = props;
    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM()} />
                <p>length is {parcel.meta.wordLength}</p>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default WordParcelHoc(WordEditor);

```

<Divider />

## Fields that interact with each other

Some forms contain fields that influence each other's values. Dataparcels can manage this through the use of `modifyBeforeUpdate`.

This example sums `a` and `b` together. If `a` or `b` are edited, then `sum = a + b`.
If `sum` is edited, `a` and `b` are scaled appropriately so they remain proportional to one another.

<InteractingFields />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';

const calculate = (value, changeRequest) => {
    let {a, b, sum} = value;

    if(changeRequest.originPath[0] !== "sum") {
        // if the change didn't come from sum, calculate sum based on a and b
        sum = a + b;
    } else {
        // if the change came from sum, scale a and b based on the change in sum
        let prevSum = changeRequest.prevData.value.sum;

        if(prevSum !== 0) {
            // if prevSum isn't zero, scale a and b to fit sum
            let scale = sum / prevSum;
            a *= scale;
            b *= scale;
        } else {
            // or else just set a and b to half of sum
            a = sum / 2;
            b = sum / 2;
        }
    }

    return {a, b, sum};
};

const SumParcelHoc = ParcelHoc({
    name: "sumParcel",
    valueFromProps: (/* props */) => ({
        a: 5,
        b: 5,
        sum: undefined
    }),
    modifyBeforeUpdate: [
        calculate
    ]
});

// turn numbers into strings on the way down
// and back into numbers on the way up
// but stop any changes that result in NaN

// numberToString is used in the Parcel.pipe() functions below
// parcel.pipe(fn) is equivalent to fn(parcel)

const numberToString = (parcel) => parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => {
        let number = Number(string);
        return (string === "" || isNaN(number)) ? CancelActionMarker : number;
    });

const AreaEditor = (props) => {
    let {sumParcel} = props;
    return <div>
        <label>a</label>
        <ParcelBoundary parcel={sumParcel.get('a').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>

        <label>b</label>
        <ParcelBoundary parcel={sumParcel.get('b').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>

        <label>sum</label>
        <ParcelBoundary parcel={sumParcel.get('sum').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default SumParcelHoc(AreaEditor);

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
