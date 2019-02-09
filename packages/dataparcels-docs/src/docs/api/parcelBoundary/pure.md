import Link from 'component/Link';

```flow
pure?: boolean = true // optional
```

Enables pure rendering. When `pure` is true, ParcelBoundary will only re-render when `parcel`'s data changes. It defaults to `true`.

Use `forceUpdate` if you would like ParcelBoundary to re-render in response to changes in other props.

**<Link to="/ui-behaviour#Pure-rendering">See an example of ParcelBoundary pure</Link>**
