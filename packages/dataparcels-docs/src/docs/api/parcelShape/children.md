```flow
children(): ParentType<ParcelShape> // only on ParentParcels
```

Returns all of the ParcelShape's children as new ParcelShapes, contained within the original ParcelShape's data structure.

```js
let value = {
    abc: 123,
    def: 456
};

let parcelShape = new ParcelShape(value);
parcelShape.children();

// returns {
//    abc: ParcelShape, // contains a value of 123
//    def: ParcelShape // contains a value of 456
// }

```
