import Link from 'component/Link';

```flow
data(): Object
```

Returns an object containing the Parcel's data, which includes:
* `value` - The Parcel's value
* `meta` - The Parcel's <Link to="/parcel-meta">meta object</Link>
* `key` - The Parcel's <Link to="/parcel-keys">key</Link>
* `child` - The Parcel's child information, which includes any `meta`, `key` and `child` data related to the `value`s children.
 
```js
let value = 123;
let parcel = new Parcel({value});
parcel.data();

// returns {
//     child: undefined,
//     key: '^',
//     meta: {},
//     value: 123,
// }
```
