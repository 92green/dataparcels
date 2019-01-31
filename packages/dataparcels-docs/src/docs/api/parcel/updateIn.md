import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
updateIn(keyPath: Array<string|number>, updater: ValueUpdater): void // only on ParentParcels
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

<ValueUpdater alt="updateShapeIn" />
