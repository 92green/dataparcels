import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
move(key: string|number): void // only on ElementParcels, will move with sibling
move(keyA: string|number, keyB: string|number): void // only on IndexedParcels, will move children
```

When called with one argument, this moves the current Parcel to the position of `key`, within the current ParentParcel.
Other elements will shift left to fill any gaps left and/or shift right to make room for moved values.

When called with two arguments, this moves the child Parcel at `keyA` to the position of `keyB`.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(2).move(0);
// this triggers a change that sets the parcel's value to ['c','a','b'];

parcel.move(2, 0);
// this also triggers a change that sets the parcel's value to ['c','a','b'];
```

<IndexedKeys />
