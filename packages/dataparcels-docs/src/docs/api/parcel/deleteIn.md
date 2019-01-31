import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
deleteIn(keyPath: Array<string|number>): void // only on ParentParcels
```

Calling `setIn()` will trigger a change that will delete the value at the provided `keyPath`.

```js
let value = {
    a: {
        b: 123
    }
};
let parcel = new Parcel({value});
parcel.deleteIn(['a','b']);
// this triggers a change that sets the parcel's value to {a: {}}
```

<IndexedKeys />
