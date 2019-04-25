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

<Message>Make sure you check out the <Link to="/ui-behaviour#Drag-and-drop-sorting">drag and drop sorting</Link> example too.</Message>

<EditingArrays />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function FruitListEditor(props) {

    let [fruitListParcel] = useParcelState({
        value: [
            "Apple",
            "Banana",
            "Crumpets"
        ]
    });

    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                    <span className="Text Text-monospace"> key {fruitParcel.key}</span>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
}

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
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

function AlphanumericInput(props) {
    return <ParcelBoundary parcel={props.alphanumericParcel}>
        {(alphanumericParcel) => {
            let parcel = alphanumericParcel.modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
            // ^ remove non alpha numeric characters on the way up
            return <input type="text" {...parcel.spreadDOM()} />;
        }}
    </ParcelBoundary>;
}

export default function AlphanumericEditor(props) {

    let [alphanumericParcel] = useParcelState({
        value: "Abc123"
    });

    return <div>
        <h4>Alphanumeric input</h4>
        <p>Disallows all non-alphanumeric characters. Try typing some punctuation.</p>
        <AlphanumericInput alphanumericParcel={alphanumericParcel} />
    </div>;
}

```

<EditingModifyNumber />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

function NumberInput(props) {
    let numberParcel = props
        .numberParcel
        .modifyUp(string => Number(string))
        .modifyDown(number => `${number}`)

    // ^ turn value into a string on the way down
    // and turn value back into a number on the way up

    // *the keepValue prop is necessary here, see note below

    return <ParcelBoundary parcel={numberParcel} keepValue>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
}

export default function NumberEditor(props) {

    let [numberParcel] = useParcelState({
        value: 123
    });

    return <div>
        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing.</p>
        <NumberInput numberParcel={numberParcel} />
    </div>;
}
```

#### The keepValue prop

The `keepValue` prop is necessary here to allow the ParcelBoundary to be the master of its own state.
So even when a non-number is entered into the input (e.g. "A"), and this is turned into `NaN` as it passes through `.modifyUp()`, the ParcelBoundary can still remember that it should contain "A".

See [ParcelBoundary.keepValue](/api/ParcelBoundary#keepValue) for more details.

<EditingModifyDelimited />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

function DelimitedStringInput(props) {
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
}

export default function DelimitedStringEditor(props) {

    let [delimitedParcel] = useParcelState({
        value: "abc.def"
    });

    return <div>
        <h4>Delimited string > array of strings</h4>
        <p>Turns a stored string into an array so array editing controls can be rendered.</p>
        <DelimitedStringInput delimitedStringParcel={delimitedParcel} />
    </div>;
}

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

This example derives the length of the word.

<DerivedValue />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function WordEditor(props) {

    let [wordParcel] = useParcelState({
        value: {
            word: "blueberries",
            wordLength: undefined
        },
        modifyBeforeUpdate: (value) => ({
            word: value.word,
            wordLength: value.word.length
        })
    });

    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>word length is {wordParcel.get('wordLength').value}</p>
    </div>;
}

```

A potential problem with the above example is that it stores derived data in the parcel's *value*. Perhaps the data shape you're editing can not or should not have a new field added to it. It is this reason that [Parcel meta](/parcel-meta) exists, which provides a convenient place to store extra data that pertains to parts of a data shape.

This example also derives the length of the word, but this time it stores it in meta. It also uses a [shape updater](/api/ParcelShape), an advanced editing feature of dataparcels. The shape updater's syntax can look a little strange, but it allows for powerful manipulations of the shape of a value.

<DerivedMeta />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';

const setWordLengthMeta = shape(parcelShape => parcelShape.setMeta({
    wordLength: parcelShape.value.word.length
}));

export default function WordEditor(props) {

    let [wordParcel] = useParcelState({
        value: {
            word: "blueberries",
            wordLength: undefined
        },
        modifyBeforeUpdate: setWordLengthMeta
    });

    return <div>
        <label>word</label>
        <ParcelBoundary parcel={wordParcel.get('word')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
        <p>word length is {wordParcel.meta.wordLength}</p>
    </div>;
}

```

<Divider />

## Fields that interact with each other

Some forms contain fields that influence each other's values. Dataparcels can manage this through the use of `modifyBeforeUpdate`.

This example sums `a` and `b` together. If `a` or `b` are edited, then `sum = a + b`.
If `sum` is edited, `a` and `b` are scaled appropriately so they remain proportional to one another.

<InteractingFields />

```js
import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';

function calculate(value, changeRequest) {
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
}

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

export default function AreaEditor(props) {

    let [sumParcel] = useParcelState({
        value: {
            a: 5,
            b: 5,
            sum: undefined
        },
        modifyBeforeUpdate: calculate
    });

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
}


```

<Divider />

## Managing your own Parcel state

If you don't want to use the <Link to="/api/ParcelHoc">ParcelHoc higher order component</Link> and would prefer to manage your Parcel's state yourself, this example demonstrates how.

This example also serves as an indication on how you might use `dataparcels` with something other than React.

<ManagingOwnParcelState />

```js
import React from 'react';
import {useState} from 'react';
import Parcel from 'react-dataparcels';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function ManagingOwnParcelState(props) {

    let [personParcel, setPersonParcel] = useState(() => new Parcel({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        },
        handleChange: (parcel) => {
            setPersonParcel(parcel);
        }
    }));

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

```
