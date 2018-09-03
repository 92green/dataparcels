import Link from 'component/Link';

```flow
id: string
```

Returns the Parcel's `id`. Under most circumstances, `id`s are unique among all Parcels that are descendants of a single original Parcel. You wont often need to use this, but it can sometimes be useful for debugging. See <Link to="/parcel-keypaths-locations-and-ids">parcel keypaths, locations and ids</Link> for more info.

```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get("abc").id; // returns "^.abc"
```
