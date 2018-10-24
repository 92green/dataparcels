import Link from 'component/Link';

```flow
pipe?: (props: Object) => (parcel: Parcel) => Parcel // optional
```

This function gives you the opportunity to modify the parcel before it reaches any other components.

The `pipe` function expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the Parcel. The result of the `pipe` function will then be passed down as props.
