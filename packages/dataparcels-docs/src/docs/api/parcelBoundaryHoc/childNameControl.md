import Link from 'component/Link';

```flow
${name}Control: ParcelBoundaryControl

type ParcelBoundaryControl = {
    release: () => void,
    cancel: () => void,
    buffered: boolean,
    buffer: Action[],
    originalParcel: Parcel
}
```

ParcelBoundaryHoc's child component will receive a ParcelBoundaryControl, which can be used to control the ParcelBoundary's action buffer, and information about the current state of the action buffer.

#### ParcelBoundaryControl

- The `release()` function will release any changes in the buffer, allowing them to propagate upward out of the ParcelBoundary.
- The `cancel()` function will cancel any changes in the buffer.
- The `buffered` boolean indicates if the ParcelBoundary currently contains changes that it hasn't yet released.
- The `buffer` array contains the actions that are currently held in the buffer.
- `originalParcel` contains the Parcel that was passed into the ParcelBoundaryHoc, unaffected by any buffering or ParcelBoundaryHoc state.

If ParcelBoundaryHoc doesn't receive a parcel as a prop at the name indicated by `config.name`, then this child prop will not exist.
