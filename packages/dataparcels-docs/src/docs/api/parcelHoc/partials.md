import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
partials?: Array<ParcelHocPartialConfig> // optional

type ParcelHocPartialConfig = {
    valueFromProps: (props: Object) => any,
    shouldParcelUpdateFromProps?: (prevProps: *, nextProps: *) => boolean, // optional
    onChange?: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void // optional,
    keys?: string[]
};
```
