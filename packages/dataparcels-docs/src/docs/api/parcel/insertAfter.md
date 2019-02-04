import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
insertAfter(value: any): void // only on ElementParcels, will insert after self
insertAfter(key: string|number, value: any): void // only on IndexedParcels, will insert after child
```

When called with one argument, this inserts `value` after the current Parcel, within the current ParentParcel.

When called with two arguments, this inserts `value` after the child Parcel at `key`.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(1).insertAfter('!');
// this triggers a change that sets the parcel's value to ['a','b','!','c'];

parcel.insertAfter(1, '!');
// this also triggers a change that sets the parcel's value to ['a','b','!','c'];
```

<IndexedKeys />
