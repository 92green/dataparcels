```flow
toArray(mapper?: ParcelMapper): Array<Parcel> // only on ParentParcels

type ParcelMapper = (
    item: Parcel,
    property: string|number,
    parent: Parcel
) => any;
```

Like [children()](#children), expect the returned data structure is cast to an array.

An optional `mapper` function can be passed, which will be called on each child.

```js
let value = {
    abc: 123,
    def: 456
};

let parcel = new Parcel({value});
parcel.toArray();

// returns [
//    Parcel, // contains a value of 123
//    Parcel // contains a value of 456
// ]

```
