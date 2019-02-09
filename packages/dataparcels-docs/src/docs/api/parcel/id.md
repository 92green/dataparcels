```flow
id: string
```

Returns the Parcel's `id`. Under most circumstances, `id`s are unique among all Parcels that are descendants of a single original Parcel. You won't often need to use this, but it can sometimes be useful for debugging.

```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get("abc").id; // returns "^.abc"
```
