import ParcelMeta from 'docs/notes/ParcelMeta.md';

```flow
meta: Object
```

Returns an object containing the parcel's meta data. 

<ParcelMeta />
 
```js
let value = 123;
let parcel = new Parcel({value});
parcel.meta; // returns {}

// set initial meta and check again
parcel
    .initialMeta({abc: 123})
    .meta; // returns {abc: 123}
```
