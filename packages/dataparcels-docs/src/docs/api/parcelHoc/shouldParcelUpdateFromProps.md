import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
shouldParcelUpdateFromProps?: (prevProps: *, nextProps: *) => boolean // optional
```

The `shouldParcelUpdateFromProps` config option allows the ParcelHoc to replace its parcel's contents based on received props.

If `shouldParcelUpdateFromProps` is set, it will be called every time props are received. It is passed three arguments:
* `prevProps` is the previous set of props received.
* `nextProps` is the next set of props received.
* `valueFromProps` is the function passed to `config.valueFromProps`

When `shouldParcelUpdateFromProps` returns true, ParcelHoc will replace all of its parcels value with `valueFromProps(nextProps)`, and it will delete all key and meta information from the parcel.

```js
ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (props) => props.data,
    shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => valueFromProps(prevProps) !== valueFromProps(nextProps)
});
```

<Box modifier="margin">
    <Message>In future there will be more options to allow key and meta data to be retained.</Message>
</Box>

<Link to="/examples/parcelhoc-updatefromprops">Example</Link>
