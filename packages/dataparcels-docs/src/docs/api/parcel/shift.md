```flow
shift(): void // only on IndexedParcels
```

This triggers a change that pops the first value off of the start of the current ParentParcel.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.shift();
// this triggers a change that sets the parcel's value to ['b','c'];
```
