```flow
push(...values: Array<*>): void // only on IndexedParcels
```

This triggers a change that pushes all provided values to the end of the current ParentParcel.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.push('d','e');
// this triggers a change that sets the parcel's value to ['a','b','c','d','e'];
```
