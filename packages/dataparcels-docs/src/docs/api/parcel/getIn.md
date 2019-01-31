import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
getIn(keyPath: Array<string|number>): Parcel // only on ParentParcels
getIn(keyPath: Array<string|number>, notSetValue: any): Parcel // only on ParentParcels
```

Returns a Parcel containing the value associated with the provided key path.
If the key path doesn't exist, a Parcel with a value of `notSetValue` will be returned.
If `notSetValue` is not provided then a Parcel with a value of 
 `undefined` will be returned.
 
```js
let value = {
    a: {
        b: 123
    }
};
let parcel = new Parcel({value});
parcel.getIn(['a','b']).value; // returns 123
parcel.getIn(['a','z']).value; // returns undefined
parcel.getIn(['a','z'], 789).value; // returns 789
```

<IndexedKeys />
