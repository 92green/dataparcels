import Link from 'component/Link';

```flow
forceUpdate?: Array<*> // optional
```

While a ParcelBoundary is using pure rendering, `forceUpdate` will force the ParcelBoundary to re-render in response to changes in other props. Each item in the `forceUpdate` array is compared using strict equality against its previous values, and if any are not strictly equal, the ParcelBoundary will re-render.

```js
// personParcel is a Parcel
// options is an array of options that are loaded after mount

<ParcelBoundary parcel={personParcel} forceUpdate={[options]}>
    {(personParcel) => <Select {...personParcel.spreadDOM()} options={options} />}
</ParcelBoundary>
```

<Link to="/examples/parcelboundary-forceupdate">Example</Link>
