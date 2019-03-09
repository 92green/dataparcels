import Link from 'component/Link';

```flow
onRelease?: (release: Function) => void // optional
```

The `onRelease` function can be used to add behaviour before or after a ParcelBoundary releases the changes in its buffer.

If `onRelease` is provided and `ParcelBoundaryControl.release()` is called, the buffer's changes are *not* immediately released, and `onRelease` is called instead. The `onRelease` function is passed a `release()` function as an argument, which will release the changes in the buffer when called.

```js
// add a delay to the release action
let onRelease = release => setTimeout(release, 1000);
<ParcelBoundary parcel={parcel} onRelease={onRelease}>
// ...
```
