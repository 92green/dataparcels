import Link from 'component/Link';

```flow
debounce?: number // optional
```

If set, `debounce` will debounce any changes that occur inside the ParcelBoundary. The number indicates the number of milliseconds to debounce.

This can be used to increase rendering performance for parcels that change value many times in rapid succession, such as text inputs.

#### Debouncing explained

When the `parcel` in the ParcelBoundary sends a change, the ParcelBoundary will catch it and prevent it from being propagated out of the boundary. The parcel on the inside of the ParcelBoundary will still update as normal.

The ParcelBoundary waits until no new changes have occured for `debounce` number of milliseconds. It then releases all the changes it has buffered, all together in a single change request.

Debouncing can be good for rendering performance because parcels outside the ParcelBoundary don't needlessly update every time a small change occurs (e.g. each time the user presses a key).

```js
// personParcel is a Parcel
<ParcelBoundary parcel={personParcel} debounce={100}>
    {(personParcel) => <input type="text" {...personParcel.spreadDOM} />}
</ParcelBoundary>
```

**<Link to="/ui-behaviour#Debouncing-changes">See an example of ParcelBoundary debounce</Link>**
