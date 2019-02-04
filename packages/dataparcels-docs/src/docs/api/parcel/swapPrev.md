import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
swapPrev(): void // only on ElementParcels, will swap with previous sibling
swapPrev(key: string|number): void // only on IndexedParcels, will swap child with previous child 
```

When called with no arguments, this swaps the current Parcel with its previous sibling Parcel, within the current ParentParcel. If called on the first child, it swaps with the last child.

When called with one argument, this swaps the child at the position of `key` with the previous sibling Parcel.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(1).swapPrev();
// this triggers a change that sets the parcel's value to ['b','a','c'];

parcel.swapPrev(1);
// this also triggers a change that sets the parcel's value to ['b','a','c'];
```

<IndexedKeys />
