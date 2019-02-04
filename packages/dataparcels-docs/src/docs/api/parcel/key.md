import Link from 'component/Link';

```flow
key: string
```

Returns the Parcel's `key`. Dataparcels automatically gives unique keys to all children of a parent parcel. See <Link to="/parcel-keys">parcel keys</Link> for more info.

Because they are unique, the can be used as keys when rendering an array of elements with React. This is demonstrated <Link to="/data-editing#Indexed-data-types">here</Link>.
 
```js
let value = {
    abc: 123,
    def: 456
};
let parcel = new Parcel({value});
parcel.get("abc").key; // returns "abc"
```

```js
let value = [
    123,
    456
];
let parcel = new Parcel({value});
parcel.get(0).key; // returns "#a"
```
