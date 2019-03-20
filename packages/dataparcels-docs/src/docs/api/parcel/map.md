import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
// updates value - only to be used if shape doesn't change
map(updater: ParcelValueUpdater): void // only on ParentParcels
type ParcelValueUpdater = (value: any) => any;

// updates shape, including meta
map(shape(shapeUpdater: ParcelShapeUpdater)): void // only on ParentParcels
type ParcelShapeUpdater = (parcelShape: ParcelShape) => any;
```

The `map()` function will trigger a change that will update every child value. It is passed each child value in order, from which you can return each intended replacement value.

```js
let value = {
    a: 1,
    b: 2,
    c: 3
};
let parcel = new Parcel({value});
parcel.map(value => value * 2);
// this triggers a change that sets the parcel's value to {a: 2, b: 4, c: 6}
```

<ValueUpdater />
