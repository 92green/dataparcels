import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
// updates value - only to be used if shape doesn't change
updateIn(keyPath: Array<string|number>, updater: ParcelValueUpdater): void // only on ParentParcels
type ParcelValueUpdater = (value: any) => any;

// updates shape, including meta
updateIn(keyPath: Array<string|number>, shape(shapeUpdater: ParcelShapeUpdater)): void // only on ParentParcels
type ParcelShapeUpdater = (parcelShape: ParcelShape) => any;
```

Calling `updateIn()` will trigger a change that will update the value at the provided `keyPath`. The value updater is passed the current value found at the `keyPath`, from which you can return the intended replacement value.

```js
let value = {
    a: {
        b: 123,
        c: 789
    }
};
let parcel = new Parcel({value});
parcel.updateIn(['a','b'], value => value + 1);
// this triggers a change that sets the parcel's value to {a: {b: 124, c: 789}}
```

<ValueUpdater />
