```flow
toObject(): {[key: string]: ParcelShape} // only on ParentParcels
```

Like [children()](#children), expect the returned data structure is cast to an object.

```js
let value = {
    abc: 123,
    def: 456
};

let parcelShape = new ParcelShape(value);
parcelShape.toObject()

// returns {
//    abc: ParcelShape, // contains a value of 123
//    def: ParcelShape // contains a value of 456
// }

```
