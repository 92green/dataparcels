import Link from 'component/Link';

```flow
onRelease?: Array<ReleaseFunction> // optional

type ReleaseFunction = (continueRelease: Function) => void
```

The `onRelease` function array can be used to add behaviour before or after a ParcelBoundaryHoc releases the changes in its buffer.

If `onRelease` is provided and `ParcelBoundaryControl.release()` is called, the buffer's changes are *not* immediately released, and the first element of `onRelease` is called instead. The `onRelease` function is passed a `continueRelease()` function as an argument, and if this `continueRelease()` function is called then it will call the next element of the `onRelease` array. If `continueRelease()` is called on the last element in the `onRelease` array, then it will release the changes in the buffer.

```js
ParcelBoundaryHoc({
    name: 'exampleParcel',
    onRelease: [
        // add a delay to the release action
        continueRelease => setTimeout(continueRelease, 1000)
    ]
});
```
