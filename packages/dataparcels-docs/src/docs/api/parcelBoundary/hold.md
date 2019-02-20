import Link from 'component/Link';

```flow
hold?: boolean = false // optional
```

When `hold` is true, all changes made to the parcel inside the ParcelBoundary are prevented from being propagated out of the boundary. The inner parcel will continue to update as normal. You can then call `actions.release()` to release all the buffered changes at once, or `actions.cancel()` to cancel all the buffered changes. This can be useful for building UIs that have a submit action.

```js
// personParcel is a Parcel
<ParcelBoundary parcel={personParcel}>
    {(personParcel, {release, cancel}) => {
        // personParcel is now inside the ParcelBoundary
        return <div>
            <input type="text" {...personParcel.spreadDOM()} />
            <button onClick={() => release()}>Submit</button>
            <button onClick={() => cancel()}>Cancel</button>
        </div>;
    }}
</ParcelBoundary>
```

<Link to="/examples/parcelboundary-hold">Example</Link>
