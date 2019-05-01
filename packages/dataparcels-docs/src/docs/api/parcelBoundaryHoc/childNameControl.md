import Link from 'component/Link';

```flow
${name}Control: ParcelBufferControl

type ParcelBufferControl = {
    release: () => void,
    clear: () => void,
    buffered: boolean,
    actions: Action[]
}
```

ParcelBoundaryHoc's child component will receive a ParcelBufferControl, which can be used to control the ParcelBoundary's action buffer, and information about the current state of the action buffer.

#### ParcelBufferControl

- The `release()` function will release any changes in the buffer, allowing them to propagate upward out of the ParcelBoundary.
- The `clear()` function will clear any changes in the buffer.
- The `buffered` boolean indicates if the ParcelBoundary currently contains changes that it hasn't yet released.
- The `actions` array contains the actions that are currently held in the buffer.

If ParcelBoundaryHoc doesn't receive a parcel as a prop at the name indicated by `config.name`, then this child prop will not exist.
