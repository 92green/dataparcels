import Link from 'component/Link';

```flow
onCancel?: (cancel: Function) => void // optional
```

The `onCancel` function can be used to add behaviour before or after a ParcelBoundary cancels the changes in its buffer.

If `onCancel` is provided and `ParcelBoundaryControl.cancel()` is called, the buffer's changes are *not* immediately cancelled, and `onCancel` is called instead. The `onCancel` function is passed a `cancel()` function as an argument, which will cancel the changes in the buffer when called.

```js
// add a delay to the cancel action
let onCancel = cancel => setTimeout(cancel, 1000);
<ParcelBoundary parcel={parcel} onCancel={onCancel}>
// ...
```
