import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
getIn(keyPath: Array<string|number>): ParcelShape // only on ParentParcels
getIn(keyPath: Array<string|number>, notSetValue: any): ParcelShape // only on ParentParcels
```

Returns a ParcelShape containing the value associated with the provided key path.
If the key path doesn't exist, a ParcelShape with a value of `notSetValue` will be returned.
If `notSetValue` is not provided then a ParcelShape with a value of 
 `undefined` will be returned.
 
```js
let value = {
    a: {
        b: 123
    }
};
let parcelShape = new ParcelShape(value);
parcelShape.get(['a','b']).value; // returns 123
parcelShape.get(['a','z']).value; // returns undefined
parcelShape.get(['a','z'], 789).value; // returns 789
```

<IndexedKeys />
