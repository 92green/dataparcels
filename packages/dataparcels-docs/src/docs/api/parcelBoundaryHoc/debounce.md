import Link from 'component/Link';

```flow
debounce?: number | (props: *) => number // optional
```

If set, `debounce` will debounce any changes that occur inside the ParcelBoundaryHoc. The number indicates the number of milliseconds to debounce.

This can be used to increase rendering performance for parcels that change value many times in rapid succession, such as text inputs.

#### Debouncing explained

When the `parcel` in the ParcelBoundaryHoc sends a change, the ParcelBoundaryHoc will catch it and prevent it from being propagated out of the boundary. The parcel on the inside of the ParcelBoundaryHoc will still update as normal.

The ParcelBoundaryHoc waits until no new changes have occured for `debounce` number of milliseconds. It then releases all the changes it has buffered, all together in a single change request.

Debouncing can be good for rendering performance because parcels outside the ParcelBoundaryHoc don't needlessly update every time a small change occurs (e.g. each time the user presses a key).
