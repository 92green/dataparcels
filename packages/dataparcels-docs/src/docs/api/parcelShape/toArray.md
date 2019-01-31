```flow
toArray(): Array<ParcelShape> // only on ParentParcels
```

Like [children()](#children), expect the returned data structure is cast to an array.

```js
let value = {
    abc: 123,
    def: 456
};

let parcelShape = new ParcelShape(value);
parcelShape.toArray();

// returns [
//    ParcelShape, // contains a value of 123
//    ParcelShape // contains a value of 456
// ]

```
