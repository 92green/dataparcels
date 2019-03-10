import Link from 'component/Link';

```flow
(parcel: Parcel, control: ParcelBoundaryControl) => Node

type ParcelBoundaryControl = {
    release: () => void,
    cancel: () => void,
    buffered: boolean,
    buffer: Action[]
}
```

ParcelBoundaries must be given a `childRenderer` function as children. This is called whenever the ParcelBoundary updates.

It is passed a `parcel` and a ParcelBoundaryControl instance.
- The `parcel` is on the "inside" of the parcel boundary, and is able to update independently of the parcel that was passed into the ParcelBoundary.
- The `control` argument passes a ParcelBoundaryControl which can be used to control the ParcelBoundary's action buffer (see the <Link to="/examples/parcelboundary-hold">hold example</Link>) and information about the current state of the action buffer.

#### ParcelBoundaryControl

- The `release()` function will release any changes in the buffer, allowing them to propagate upward out of the ParcelBoundary.
- The `cancel()` function will cancel any changes in the buffer.
- The `buffered` boolean indicates if the ParcelBoundary currently contains changes that it hasn't yet released.
- The `buffer` array contains the actions that are currently held in the buffer.
- `originalParcel` contains the Parcel that was passed into the ParcelBoundary, unaffected by any buffering or ParcelBoundary state.

The return value of `childRenderer` will be rendered.

```js
// personParcel is a Parcel
<ParcelBoundary parcel={personParcel}>
    {(parcel, control) => {
        return <input type="text" {...parcel.spreadDOM()} />;
    }}
</ParcelBoundary>
```
