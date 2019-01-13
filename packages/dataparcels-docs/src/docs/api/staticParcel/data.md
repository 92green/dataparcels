import Link from 'component/Link';

```flow
data: Object
```

Returns an object containing the StaticParcel's data, which includes:
* `value` - The StaticParcel's value
* `meta` - The StaticParcel's <Link to="/parcel-meta">meta object</Link>
* `key` - The StaticParcel's <Link to="/parcel-keys">key</Link>
* `child` - The StaticParcel's child information, which includes any `meta`, `key` and `child` data related to the `value`s children.
