import Link from 'component/Link';

```flow
keepValue?: boolean = false // optional
```

The default behaviour of ParcelBoundary is to update its contents whenever it receives a new Parcel via props. This behaviour is preferred in nearly all use cases.

If `keepValue` is true on a ParcelBoundary, and if that ParcelBoundary propagates a change, then that ParcelBoundary will *not* update its value when it receives a new Parcel via props.

This is useful when <Link to="/api/Parcel#modify_methods">modify methods</Link> are being used above the ParcelBoundary, which change the data type on its trip up to the top level Parcel and back down again.

```js
let numberParcel = parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => Number(string));

return <ParcelBoundary parcel={numberParcel} keepValue>
    {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
</ParcelBoundary>;

```

The `keepValue` prop is necessary here to allow the ParcelBoundary to be the master of its own state, at least in regards to changes that come from itself. So even when a non-number is entered into the input (e.g. "A"), and this is turned into `NaN` as it passes through `.modifyUp()`, the ParcelBoundary can still remember that it should contain "A".

Other values that are preserved in this example are "0.10", which would be turned into "0.1" by the modify functions, and "0.0000001", which would be turned into "1e-7".

<Link to="/data-editing#Modifying-data-to-fit-the-UI">Example</Link>
