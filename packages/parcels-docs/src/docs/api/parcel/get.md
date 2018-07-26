import IndexedKeys from '../../notes/IndexedKeys.md';

```flow
get(key: string|number): Parcel
get(key: string|number, notSetValue: *): Parcel
```

Returns a Parcel containing the value associated with the provided key / index.
If the key / index doesn't exist, a Parcel with a value of `notSetValue` will be returned.
If `notSetValue` is not provided then a Parcel with a value of 
 `undefined` will be returned.
 
```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get('abc').value(); // returns 123
parcel.get('xyz').value(); // returns undefined
parcel.get('xyz', 789).value(); // returns 789
```

#### get() with indexed values

When called on a Parcel with an indexed value, such as an array, `get()` can accept an `index` or a `key`.
- `index` (number) is used to get a value based off its position. It can also be negative, indicating an offset from the end of the sequence.
- `key` (string) is used to get a specific value by its unique key within the parcel.

<IndexedKeys />

```js
let value = ['abc', 'def', 'ghi'];
let parcel = new Parcel({value});
parcel.get(0).value(); // returns 'abc'
parcel.get(-1).value(); // returns 'ghi'
parcel.get('#a').value(); // returns 'abc'
```
