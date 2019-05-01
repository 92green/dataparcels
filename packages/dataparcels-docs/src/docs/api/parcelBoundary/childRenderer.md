import Link from 'component/Link';

```flow
(parcel: Parcel, buffer: ParcelBufferControl) => Node

type ParcelBufferControl = {
    release: () => void,
    clear: () => void,
    buffered: boolean,
    actions: Action[]
}
```

ParcelBoundaries must be given a `childRenderer` function as children. This is called whenever the ParcelBoundary updates.

It is passed a `parcel` and a ParcelBufferControl instance.
- The `parcel` is on the "inside" of the parcel boundary, and is able to update independently of the parcel that was passed into the ParcelBoundary.
- The `buffer` argument passes a ParcelBufferControl which can be used to control the ParcelBoundary's action buffer and information about the current state of the action buffer.

#### ParcelBufferControl

- The `release()` function will release any changes in the buffer, allowing them to propagate upward out of the ParcelBoundary.
- The `clear()` function will clear any changes in the buffer.
- The `buffered` boolean indicates if the ParcelBoundary currently contains changes that it hasn't yet released.
- The `actions` array contains the actions that are currently held in the buffer.

The return value of `childRenderer` will be rendered.

```js
// personParcel is a Parcel
<ParcelBoundary parcel={personParcel}>
    {(parcel, buffer) => {
        return <input type="text" {...parcel.spreadDOM()} />;
    }}
</ParcelBoundary>
```
