import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
shouldParcelUpdateFromProps?: (prevValue: *, nextValue: *) => boolean // optional
```

The `shouldParcelUpdateFromProps` config option allows the ParcelHoc to replace its parcel's contents based on received props.

If `shouldParcelUpdateFromProps` is set, it will be called every time props are received. It is passed two arguments:
* `prevValue` is the value of the ParcelHoc's current parcel.
* `nextValue` is the result of passing the new props through `config.valueFromProps`

When `shouldParcelUpdateFromProps` returns true, ParcelHoc will replace all of its parcels value with `nextValue`, and it will delete all key and meta information from the parcel.

```js
ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (props) => props.data,
    shouldParcelUpdateFromProps: (prevValue, nextValue) => prevValue.xyz !== nextValue.xyz
});
```

<Box modifier="margin">
    <Message>In future there will be more options to allow partial changes, and to allow key and meta data to be retained.</Message>
</Box>

<Link to="/examples/parcelhoc-updatefromprops">Example</Link>
