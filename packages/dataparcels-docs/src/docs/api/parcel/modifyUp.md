import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
// updates value - only to be used if shape doesn't change
modifyUp(updater: ParcelValueUpdater): Parcel
type ParcelValueUpdater = (value: any, changeRequest: ChangeRequest) => any;

// updates shape, including meta
modifyUp(shape(shapeUpdater: ParcelShapeUpdater)): Parcel
type ParcelShapeUpdater = (parcelShape: ParcelShape, changeRequest: ChangeRequest) => any;
```

`modifyUp()` lets you modify a Parcel's new value when a change is being propagated upward.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel
    .modifyUp(value => value.toUpperCase());
    .set("def");

// this triggers a change to set the value to "def"
// which propagates upward through .modifyUp()
// .modifyUp() turns "def" into "DEF"
// and the change request continues up to the original Parcel

// The Parcel then has a new value of "DEF"
```

It does not trigger any changes of its own, but awaits a change from below. Values from above are passed through unchanged.

The modify methods are particularly useful when your Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. The `modifyDown()` and `modifyUp()` methods are often used with one another to make a value editable on the way down, and turn it back on the way up.

#### Cancelling a change

You can also cancel a change by returning `CancelActionMarker` from `modifyUp()`'s updater. This allows you to programatically prevent certain changes from being applied to the data in the top level Parcel. This example shows an input that cancels any changes that would set the value to `null`:

```js
import CancelActionMarker from 'dataparcels/CancelActionMarker';
// or
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';

let parcel = new Parcel({
    value: 123
})

parcel = parcel.modifyUp(value => value === null ? CancelActionMarker : value);

parcel.set(456); // this would work, value becomes 123
parcel.set(null); // this would cause no change

```

<ValueUpdater />
