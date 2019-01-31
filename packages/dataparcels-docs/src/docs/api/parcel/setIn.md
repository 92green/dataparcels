import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
setIn(keyPath: Array<string|number>, value: any): void // only on ParentParcels
```

Calling `setIn()` will trigger a change that will set the value at the provided `keyPath`.

```js
let value = {
    a: {
        b: 123,
        c: 789
    }
};
let parcel = new Parcel({value});
parcel.setIn(['a','b'], 456);
// this triggers a change that sets the parcel's value to {a: {b: 456, c: 789}}
```

<IndexedKeys />
