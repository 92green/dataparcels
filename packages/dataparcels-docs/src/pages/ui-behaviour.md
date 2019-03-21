import Link from 'gatsby-link';
import SubmitButton from 'examples/SubmitButton';
import ValidationExample from 'examples/ValidationExample';
import Autosave from 'examples/Autosave';
import EditingArraysDrag from 'examples/EditingArraysDrag';
import EditingArraysFlipMove from 'examples/EditingArraysFlipMove';
import ParcelBoundaryDebounce from 'examples/ParcelBoundaryDebounce';
import ParcelBoundaryPure from 'examples/ParcelBoundaryPure';
import ParcelMetaConfirmingDeletions from 'examples/ParcelMetaConfirmingDeletions';
import ParcelMetaSelections from 'examples/ParcelMetaSelections';
import {Divider} from 'dcme-style';

# UI Behaviour

UI behaviour covers features that help the user interact with the data.

## Submit buttons and autosave

Dataparcels is very often used with data that's fetched from a server, and saved back to a server. When dataparcels is used like this, it's useful to prevent the user's changes from being immediately sent back to the server and instead hold onto them momentarily. We can either wait for the user to choose to send their changes, or wait until an amount of time has passed since the user has made a change, and *then* save the changes to the server.

There is a common pattern to do this using React and Dataparcels, by using multiple higher order components:

```js
ParcelHoc         // holds the data fetched from the server
  |               // and sends changes to the server
  V
ParcelBoundaryHoc // holds the changes that the user has made
  |               // and momentarily prevents those changes
  |               // from being propagated back up to the ParcelHoc
  V
Editor            // allows the user to make changes to the data
```

Using this pattern, the "submit" button is really an action that instructs a ParcelBoundaryHoc to release all of its buffered changes, allowing them to propagate back up to the ParcelHoc.

The examples below show this in action, however in an actual app you would still need to configure the ParcelHoc to send the changes to the server. [Data Synchronisation](/data-synchronisation) describes how that can be done.

### Submit button example

<SubmitButton />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import composeWith from 'unmutable/composeWith';

const PersonEditor = (props) => {
    let {personParcel, personParcelControl} = props;
    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <button onClick={() => personParcelControl.release()}>Submit</button>
        <button onClick={() => personParcelControl.cancel()}>Cancel</button>
    </div>;
};

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ParcelHoc({
        name: "personParcel",
        valueFromProps: (/* props */) => ({
            firstname: "Robert",
            lastname: "Clamps"
        })
    }),
    ParcelBoundaryHoc({
        name: "personParcel",
        hold: true
        // ^ hold onto changes until the user releases them
    }),
    PersonEditor
);
```

### Autosave example

<Autosave />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import composeWith from 'unmutable/composeWith';

const PersonEditor = (props) => {
    let {personParcel, personParcelControl} = props;
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
};

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ParcelHoc({
        name: "personParcel",
        valueFromProps: (/* props */) => ({
            firstname: "Robert",
            lastname: "Clamps"
        })
    }),
    ParcelBoundaryHoc({
        name: "personParcel",
        debounce: 500
        // ^ hold onto changes until 500ms have elapsed since last change
    }),
    PersonEditor
);
```

<Divider />

## Validation on user input

Dataparcels' [Validation plugin](/api/Validation) provides an easy way to test whether data conforms to a set of validation rules, show errors to the user, and prevent changes from being released until the data is valid.

Try removing the value of the `name` field, or choosing a non-numeric or negative value for the amount of animals.

<ValidationExample />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import Validation from 'react-dataparcels/Validation';
import composeWith from 'unmutable/composeWith';

const numberToString = (parcel) => parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => Number(string));

const InputWithError = (parcel) => <div>
    <input type="text" {...parcel.spreadDOM()} />
    {parcel.meta.invalid && `Error: ${parcel.meta.invalid}`}
</div>;

const AnimalEditor = (props) => {
    let {animalParcel, animalParcelControl} = props;
    let {valid} = animalParcel.meta;

    return <div>
        <label>name</label>
        <ParcelBoundary parcel={animalParcel.get('name')}>
            {InputWithError}
        </ParcelBoundary>

        <div className="Box Box-paddingLeft">
            {animalParcel.get('animals').toArray((animalParcel) => {
                return <ParcelBoundary parcel={animalParcel} key={animalParcel.key}>
                    {(animalParcel) => <div>
                        <label>type</label>
                        <ParcelBoundary parcel={animalParcel.get('type')}>
                            {InputWithError}
                        </ParcelBoundary>

                        <label>amount</label>
                        <ParcelBoundary parcel={animalParcel.get('amount').pipe(numberToString)} keepValue>
                            {InputWithError}
                        </ParcelBoundary>

                        <button onClick={() => animalParcel.swapPrev()}>^</button>
                        <button onClick={() => animalParcel.swapNext()}>v</button>
                        <button onClick={() => animalParcel.delete()}>x</button>
                    </div>}
                </ParcelBoundary>;
            })}
            <button onClick={() => animalParcel.get('animals').push({type: "?", amount: 0})}>Add new animal</button>
        </div>

        <button onClick={() => valid && animalParcelControl.release()}>{valid ? "Submit" : "Can't submit"}</button>
        <button onClick={() => animalParcelControl.cancel()}>Cancel</button>
    </div>;
};

const validateStringNotBlank = (name) => (value) => {
    return (!value || value.trim().length === 0) && `${name} must not be blank`;
};

const validateInteger = (name) => (value) => {
    return !Number.isInteger(value) && `${name} must be a whole number`;
};

const validatePositiveNumber = (name) => (value) => {
    return value < 0 && `${name} must not be negative`;
};

const validation = Validation({
    'name': validateStringNotBlank("Name"),
    'animals.*.type': validateStringNotBlank("Animal type"),
    'animals.*.amount': [
        validateInteger("Animal amount"),
        validatePositiveNumber("Animal amount")
    ]
});

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ParcelHoc({
        name: "animalParcel",
        valueFromProps: (/* props */) => ({
            name: "Robert Clamps",
            animals: [
                {type: "Sheep", amount: 6}
            ]
        })
    }),
    ParcelBoundaryHoc({
        name: "animalParcel",
        hold: true,
        modifyBeforeUpdate: [validation.modifyBeforeUpdate]
    }),
    AnimalEditor
);

```

<Divider />

## Confirmation

This example shows how to display a confirmation message with options. Try deleting an item in the demo below.

This uses [parcel meta](/parcel-meta), a generic way of storing extra data that pertains to parts of a data shape. In this case, `confirming` is being stored against each element in the array.

<ParcelMetaConfirmingDeletions />

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

<Divider />

## Selections

This example shows how to use meta stored against each element in an array to keep track of which items have been selected.

<ParcelMetaSelections />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';

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

    let selectedFruit = fruitListParcel
        .toArray()
        .filter(fruit => fruit.meta.selected);

    let allSelected = fruitListParcel.value.length === selectedFruit.length;
    let selectAll = (selected) => fruitListParcel.map(shape(
        fruit => fruit.setMeta({selected})
    ));

    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => {
                    let selectedParcel = parcel.metaAsParcel('selected');
                    
                    let checkboxProps = {
                        checked: !!selectedParcel.value,
                        onChange: (event) => selectedParcel.set(event.currentTarget.checked)
                    };

                    return <div>
                        <input type="text" {...parcel.spreadDOM()} />
                        <input type="checkbox" style={{width: '2rem'}} {...checkboxProps} />
                        <button onClick={() => parcel.swapPrev()}>^</button>
                        <button onClick={() => parcel.swapNext()}>v</button>
                        <button onClick={() => parcel.delete()}>x</button>
                    </div>;
                }}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
        {allSelected
            ? <button onClick={() => selectAll(false)}>Select none</button>
            : <button onClick={() => selectAll(true)}>Select all</button>
        }
        <h4>Selected fruit:</h4>
        <ul>
            {selectedFruit.map((fruitParcel) => {
                return <li key={fruitParcel.key}>
                    <button onClick={() => fruitParcel.setMeta({selected: false})}>x</button>
                    {fruitParcel.value}
                </li>;
            })}
        </ul>
    </div>;
};

export default FruitListParcelHoc(FruitListEditor);

```

<Divider />

## Drag and drop sorting

Drag and drop is easy using [react-dataparcels-drag](https://www.npmjs.com/package/react-dataparcels-drag), which is a slim wrapper around [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc). Drag items up and down to change their order.

The `react-dataparcels-drag` hoc attempts to keep a very similar API to `react-sortable-hoc`, and therefore its usage is a little different compared to the other hocs in `react-dataparcels`.

<EditingArraysDrag />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelDrag from 'react-dataparcels-drag';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const SortableFruitList = ParcelDrag({
    element: (fruitParcel) => <ParcelBoundary parcel={fruitParcel}>
        {(parcel) => <div className="Box-draggable">
            <input type="text" {...parcel.spreadDOM()} />
            <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
            <button onClick={() => parcel.delete()}>x</button>
        </div>}
    </ParcelBoundary>
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <div>
        <SortableFruitList parcel={fruitListParcel} />
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(FruitListEditor);
```

### Alternatively, animations with react-flip-move

Dataparcels' also plays nicely with [react-flip-move](https://github.com/joshwcomeau/react-flip-move) because of its automatic keying. Add, remove and move items to see.

<EditingArraysFlipMove />

```js
import React from 'react';
import FlipMove from 'react-flip-move';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <FlipMove>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </FlipMove>;
};

const FruitListParcelHoc = ParcelHoc({
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ],
    name: "fruitListParcel"
});

export default FruitListParcelHoc(FruitListEditor);

```

<Divider />

## Debouncing changes

Debouncing can be used to increase rendering performance for parcels that change value many times in rapid succession, such as text inputs. This feature is available through use of <Link to="/api/ParcelBoundary#debounce">ParcelBoundary</Link> or <Link to="/api/ParcelBoundaryHoc#debounce">ParcelBoundaryHoc</Link>.

Debouncing can be good for rendering performance because parcels outside the ParcelBoundary don't needlessly update every time a small change occurs (e.g. each time the user presses a key).

<ParcelBoundaryDebounce />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const FoodParcelHoc = ParcelHoc({
    name: "foodParcel",
    valueFromProps: (/* props */) => ({
        mains: "Soup",
        dessert: "Strudel"
    })
});

const FoodEditor = (props) => {
    let {foodParcel} = props;
    return <div>
        <label>mains (with 300ms debounce)</label>
        <ParcelBoundary parcel={foodParcel.get('mains')} debounce={300}>
            {(mains) => <input type="text" {...mains.spreadDOM()} />}
        </ParcelBoundary>

        <label>dessert (without debounce)</label>
        <ParcelBoundary parcel={foodParcel.get('dessert')}>
            {(dessert) => <input type="text" {...dessert.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default FoodParcelHoc(FoodEditor);

```

<Divider />

## Pure rendering

Pure rendering is achieved automatically through the use of <Link to="/api/ParcelBoundary">ParcelBoundaries</Link>. In this example, ParcelBoundaries render as coloured boxes. As you type in an input, the colours will change to indicate which ParcelBoundaries have re-rendered. 

<ParcelBoundaryPure />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        name: {
            first: "Robert",
            last: "Clamps"
        },
        age: "33",
        height: "160"
    })
});

const DebugRender = ({children}) => {
    // each render, have a new, random background colour
    let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
    let style = {
        backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
        padding: "1rem",
        marginBottom: "1rem"
    };
    return <div style={style}>{children}</div>;
};

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <label>name</label>
        <ParcelBoundary parcel={personParcel.get('name')}>
            {(name) => <DebugRender>
                <label>first</label>
                <ParcelBoundary parcel={name.get('first')}>
                    {(first) => <DebugRender>
                        <input type="text" {...first.spreadDOM()} />
                    </DebugRender>}
                </ParcelBoundary>

                <label>last</label>
                <ParcelBoundary parcel={name.get('last')}>
                    {(last) => <DebugRender>
                        <input type="text" {...last.spreadDOM()} />
                    </DebugRender>}
                </ParcelBoundary>
            </DebugRender>
        }
        </ParcelBoundary>

        <label>age</label>
        <ParcelBoundary parcel={personParcel.get('age')}>
            {(age) => <DebugRender>
                <input type="text" {...age.spreadDOM()} />
            </DebugRender>}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```
