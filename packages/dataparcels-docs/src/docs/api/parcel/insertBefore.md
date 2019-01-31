import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
insertBefore(value: any): void // only on ElementParcels, will insert before self
insertBefore(key: string|number, value: any): void // only on IndexedParcels, will insert before child
```

When called with one argument, this inserts `value` before the current Parcel, within the current ParentParcel.
When called with two arguments, this inserts `value` as the next sibling Parcel before the child Parcel at `key`.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.get(1).insertBefore('!');
// this triggers a change that sets the parcel's value to ['a','!','b','c'];

parcel.insertBefore(1, '!');
// this also triggers a change that sets the parcel's value to ['a','!','b','c'];
```

<IndexedKeys />
