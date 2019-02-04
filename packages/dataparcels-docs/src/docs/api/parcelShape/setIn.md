import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
setIn(keyPath: Array<string|number>, value: any): ParcelShape // only on ParentParcels
```

Calling `setIn()` will return a new ParcelShape where the value at the provided `keyPath` has been set to `value`.

```js
let value = {
    a: {
        b: 123,
        c: 789
    }
};
let parcelShape = new ParcelShape(value);
parcelShape.set(['a','b'], 456);
// returns a new ParcelShape containing {a: {b: 456, c: 789}}
```

<IndexedKeys />
