import Link from 'component/Link';

```flow
data: Object
```

Returns an object containing the ParcelShape's data, which includes:
* `value` - The ParcelShape's value
* `meta` - The ParcelShape's <Link to="/parcel-meta">meta object</Link>
* `key` - The ParcelShape's <Link to="/parcel-keys">key</Link>
* `child` - The ParcelShape's child information, which includes any `meta`, `key` and `child` data related to the `value`s children.
