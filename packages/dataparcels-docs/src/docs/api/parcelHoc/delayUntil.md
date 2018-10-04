import Link from 'component/Link';

```flow
delayUntil?: (props: Object) => boolean // optional
```

You can delay the creation of the parcel by providing an `delayUntil` function. It will be called on mount and at every prop change until the parcel is created. It is passed `props`, and the Parcel will not be created until `true` is returned. A value of `undefined` will be passed down until the Parcel is created. Once the returned value is `true`, the Parcel will be created with the props at that time.

<Link to="/examples/parcelhoc-delayuntil">Example</Link>
