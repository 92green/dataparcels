import Link from 'component/Link';

```flow
keepState?: boolean = false // optional
```

The default behaviour of ParcelBoundary is to update its contents whenever the Parcel it receives via props has changed.

When `keepState` is true, it ensures that any changes that originate from inside the ParcelBoundary are not overwritten by the incoming new props containing the updated value. This won't be a problem for most ParcelBoundaries, but it can be if <Link to="/api/Parcel#modify_methods">modify methods</Link> are being used above the ParcelBoundary, and if those modify methods subtly change the value that ends up being passed back down into the ParcelBoundary. In this situation you may see inputs change more than what was typed into the input.

The `keepState` option effectively makes the ParcelBoundary the master of its own state, and *not* the Parcel it receives via props. The one exception is if the  change originates from outside the ParcelBoundary, in which case the ParcelBoundary will update its contents like normal.

```js
let numberParcel = parcel
    .modifyDown(number => `${number}`)
    // ^ turn value into a string on the way down
    .modifyUp(string => Number(string.replace(/[^0-9]/g, "")));
    // ^ turn value back into a number on the way up

return <ParcelBoundary parcel={numberParcel} keepState>
    {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
</ParcelBoundary>;

// without keepState, if you type "0.10" in the input above it would
// immediately be replaced with "0.1", as the new value is turned
// into a number on the way up, and into a string on the way down,
// which would make typing very frustrating.
// keepState keeps "0.10" in the text field.
```

<Link to="/data-editing#Modifying-data-to-fit-the-UI">Example</Link>
