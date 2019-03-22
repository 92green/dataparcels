import Link from 'component/Link';

```flow
keepValue?: boolean = false // optional
```

The default behaviour of ParcelBoundary is to update its contents whenever it receives a new Parcel via props. This behaviour is preferred in nearly all use cases.

If `keepValue` is true on a ParcelBoundary, and if that ParcelBoundary propagates a change, then that ParcelBoundary will *not* update its value when it receives a new Parcel via props.

This is useful when <Link to="/api/Parcel#modify_methods">modify methods</Link> are being used above the ParcelBoundary, which change the data type on it's trip up to the top level Parcel and back down again.

```js
let numberParcel = parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => Number(string));

return <ParcelBoundary parcel={numberParcel} keepValue>
    {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
</ParcelBoundary>;

// without keepValue, if you type "0.10" in the input above it would
// immediately be replaced with "0.1", as the new value is turned
// into a number on the way up, and into a string on the way down,
// which would make typing very frustrating.

// keepValue keeps "0.10" in the text field.
```

<Link to="/data-editing#Modifying-data-to-fit-the-UI">Example</Link>
