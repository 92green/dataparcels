import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
swapNext(): void // only on ElementParcels, will swap with next sibling
swapNext(key: string|number): void // only on IndexedParcels, will swap child with next child
```

When called with no arguments, this swaps the current Parcel with its next sibling Parcel, within the current ParentParcel. If called on the last child, it swaps with the first child.

When called with one argument, this swaps the child at the position of `key` with the next sibling Parcel.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(0).swapNext();
// this triggers a change that sets the parcel's value to ['b','a','c'];

parcel.swapNext(0);
// this also triggers a change that sets the parcel's value to ['b','a','c'];
```

<IndexedKeys />
