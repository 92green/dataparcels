import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
get(key: string|number): StaticParcel // only on ParentParcels
get(key: string|number, notSetValue: any): StaticParcel // only on ParentParcels
```

Returns a StaticParcel containing the value associated with the provided key / index.
If the key / index doesn't exist, a StaticParcel with a value of `notSetValue` will be returned.
If `notSetValue` is not provided then a StaticParcel with a value of 
 `undefined` will be returned.
 
```js
let value = {
    abc: 123,
    def: 456
};
let staticParcel = new StaticParcel(value);
staticParcel.get('abc').value; // returns 123
staticParcel.get('xyz').value; // returns undefined
staticParcel.get('xyz', 789).value; // returns 789
```

#### get() with indexed values

When called on a StaticParcel with an indexed value, such as an array, `get()` can accept an `index` or a `key`.
- `index` (number) is used to get a value based off its position. It can also be negative, indicating an offset from the end of the sequence.
- `key` (string) is used to get a specific value by its unique key within the StaticParcel.

<IndexedKeys />

```js
let value = ['abc', 'def', 'ghi'];
let staticParcel = new StaticParcel(value);
staticParcel.get(0).value; // returns 'abc'
staticParcel.get(-1).value; // returns 'ghi'
staticParcel.get('#a').value; // returns 'abc'
```
