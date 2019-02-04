```flow
children(mapper?: ParcelMapper): ParentType<Parcel> // only on ParentParcels

type ParcelMapper = (
    item: Parcel,
    property: string|number,
    parent: Parcel
) => any;
```

Returns all of the Parcel's children as new ChildParcels, contained within the original Parcel's data structure.

An optional `mapper` function can be passed, which will be called on each child.

```js
let value = {
    abc: 123,
    def: 456
};

let parcel = new Parcel({value});
parcel.children();

// returns {
//    abc: Parcel, // contains a value of 123
//    def: Parcel // contains a value of 456
// }

```
