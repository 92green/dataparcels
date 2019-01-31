```flow
toObject(mapper?: ParcelMapper): Object<Parcel> // only on ParentParcels

type ParcelMapper = (
    item: Parcel,
    property: string|number,
    parent: Parcel
) => any;
```

Like [children()](#children), expect the returned data structure is cast to an object.

An optional `mapper` function can be passed, which will be called on each child.

```js
let value = {
    abc: 123,
    def: 456
};

let parcel = new Parcel({value});
parcel.toObject();

// returns {
//    abc: Parcel, // contains a value of 123
//    def: Parcel // contains a value of 456
// }

```
