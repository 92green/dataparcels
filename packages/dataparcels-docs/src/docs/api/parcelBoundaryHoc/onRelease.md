import Link from 'component/Link';

```flow
onRelease?: (release: Function) => void // optional
```

The `onRelease` function can be used to add behaviour before or after a ParcelBoundaryHoc releases the changes in its buffer.

If `onRelease` is provided and `ParcelBoundaryControl.release()` is called, the buffer's changes are *not* immediately released, and `onRelease` is called instead. The `onRelease` function is passed a `release()` function as an argument, which will release the changes in the buffer when called.
