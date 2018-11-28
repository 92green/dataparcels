import Link from 'component/Link';

```flow
onChange?: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void // optional
```

The `onChange` function is called whenever ParcelHoc changes. It expects to be given a double barrel function. The first function will be passed `props`, and the next is passed the recently-changed Parcel. It is only fired if the value actually changes.

`onChange` is often used to relay changes further up the React DOM heirarchy. This works in a very similar way to [uncontrolled components in React](https://reactjs.org/docs/uncontrolled-components.html).

<Link to="/examples/parcelhoc-onchange">Example</Link>
