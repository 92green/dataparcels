import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
delete(): void // only on ChildParcels
delete(key: string|number): void // only on ParentParcels, will delete a child
```

Calling `delete()` with no arguments will trigger a change that will delete the current Parcel off of its parent. This variation of the `delete()` method only exists on ChildParcels.

On ParentParcels this method can be called with a `key`, which deletes the child value at that key.

```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get('abc').delete();
// this triggers a change that sets the parcel's value to {def: 456}

parcel.delete('abc');
// this also triggers a change that sets the parcel's value to {def: 456}
```

<IndexedKeys />
