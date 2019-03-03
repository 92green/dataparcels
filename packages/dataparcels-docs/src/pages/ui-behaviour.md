import Link from 'gatsby-link';
import SubmitButton from 'examples/SubmitButton';
import Autosave from 'examples/Autosave';
import EditingArraysDrag from 'examples/EditingArraysDrag';
import EditingArraysFlipMove from 'examples/EditingArraysFlipMove';
import ParcelBoundaryDebounce from 'examples/ParcelBoundaryDebounce';
import ParcelBoundaryPure from 'examples/ParcelBoundaryPure';
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

* 📐 Feature in design phase

<Divider />

## Confirmation

* 👍 Necessary features complete
* 🚧 Example under construction

<Divider />

## Selections

* 👍 Necessary features complete
* 🚧 Example under construction

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

Pure rendering is achieved through the use of <Link to="/api/ParcelBoundary">ParcelBoundaries</Link>. In this example, ParcelBoundaries render as coloured boxes. As you type in an input, the colours will change to indicate which ParcelBoundaries have re-rendered. 

Note how the `height` field has a prop of `pure={false}`, and therefore updates every time there is a change.

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

        <label>height (not pure)</label>
        <ParcelBoundary parcel={personParcel.get('height')} pure={false}>
            {(height) => <DebugRender>
                <input type="text" {...height.spreadDOM()} />
            </DebugRender>}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```
