```flow
pop(): void // only on IndexedParcels
```

This triggers a change that pops the last value off of the end of the current ParentParcel.

```js
let value = ['a','b','c'];
let parcel = new Parcel({value});
parcel.pop();
// this triggers a change that sets the parcel's value to ['a','b'];
```
