import Link from 'component/Link';

```flow
parcel: Parcel
```

The parcel that the ParcelBoundary will apply to. By default the ParcelBoundary will only update when `parcel`'s data changes.

The `parcel` can be accessed from inside the ParcelBoundary via the first argument of the child renderer function, as shown here.

```js
// personParcel is a Parcel
<ParcelBoundary parcel={personParcel}>
    {(personParcel) => {
        // personParcel is now inside the ParcelBoundary
        return <input type="text" {...personParcel.spreadDOM} />;
    }}
</ParcelBoundary>
```
