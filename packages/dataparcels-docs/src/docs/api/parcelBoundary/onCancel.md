import Link from 'component/Link';

```flow
onCancel?: Array<ContinueChainFunction> // optional

type ContinueChainFunction = (continueCancel: Function) => void
```

The `onCancel` function array can be used to add behaviour before or after a ParcelBoundary cancels the changes in its buffer.

If `onCancel` is provided and `ParcelBoundaryControl.cancel()` is called, the buffer's changes are *not* immediately cancelled, and the first element of `onCancel` is called instead. The `onCancel` function is passed a `continueCancel()` function as an argument, and if this `continueCancel()` function is called then it will call the next element of the `onCancel` array. If `continueCancel()` is called on the last element in the `onCancel` array, then it will cancel the changes in the buffer.

```js
// add a delay to the cancel action
let onCancel = continueCancel => setTimeout(continueCancel, 1000);
<ParcelBoundary parcel={parcel} onCancel={[onCancel]}>
// ...
```
