import Link from 'component/Link';

```flow
hold?: boolean | (props: *) => boolean // optional
```

When `hold` is true, all changes made to the parcel inside the ParcelBoundaryHoc are prevented from being propagated out of the boundary. The parcel beneath will continue to update as normal. You can then call the `release()` action to release all the buffered changes at once, or the `cancel()` action to cancel all the buffered changes. This can be useful for building UIs that have a submit action.
