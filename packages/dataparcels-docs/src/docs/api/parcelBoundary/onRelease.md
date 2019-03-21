import Link from 'component/Link';

```flow
onRelease?: Array<ContinueChainFunction> // optional

type ContinueChainFunction = (continueRelease: Function) => void
```

The `onRelease` function array can be used to add behaviour before or after a ParcelBoundary releases the changes in its buffer.

If `onRelease` is provided and `ParcelBoundaryControl.release()` is called, the buffer's changes are *not* immediately released, and the first element of `onRelease` is called instead. The `onRelease` function is passed a `continueRelease()` function as an argument, and if this `continueRelease()` function is called then it will call the next element of the `onRelease` array. If `continueRelease()` is called on the last element in the `onRelease` array, then it will release the changes in the buffer.

```js
// add a delay to the release action
let onRelease = continueRelease => setTimeout(continueRelease, 1000);
<ParcelBoundary parcel={parcel} onRelease={[onRelease]}>
// ...
```
