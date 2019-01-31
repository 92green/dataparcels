import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
swap(key: string|number): void // only on ElementParcels, will swap with sibling
swap(keyA: string|number, keyB: string|number): void // only on IndexedParcels, will swap children
```

When called with one argument, this swaps the current Parcel with the one at the position of `key`, within the current ParentParcel.

When called with two arguments, this swaps the child Parcel at `keyA` with the one at the position of `keyB`.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(0).swap(1);
// this triggers a change that sets the parcel's value to ['b','a','c'];

parcel.swap(0, 1);
// this also triggers a change that sets the parcel's value to ['b','a','c'];
```

<IndexedKeys />
