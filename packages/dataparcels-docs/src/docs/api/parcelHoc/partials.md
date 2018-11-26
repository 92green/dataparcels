import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
partials?: Array<ParcelHocPartialConfig> // optional

type ParcelHocPartialConfig = {
    valueFromProps: (props: Object) => Object,
    shouldParcelUpdateFromProps?: (prevProps: *, nextProps: *) => boolean, // optional
    onChange?: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void // optional,
    keys?: string[]
};
```

ParcelHoc allows parts of its parcel to be sourced and controlled by more than one source of state.

When using `partials`, the value of the Parcel in the ParcelHoc defaults to an object, and each partial can affect one or more keys on that object, as defined by the `keys` ParcelHocPartialConfig configuration option. If `keys` is not set on a partial, then it affects all keys not mentioned in the other partials.

Each of the configuration options on `ParcelHocPartialConfig` works like they normally do on ParcelHoc with the following exceptions:

- `valueFromProps` must return an object containing the keys nominated in `keys`. Any extra keys will be ignored. This partial value will be merged onto the parcel's value.
- `onChange` only fires when any of the values in the current partial have changed.

If `partials` is set, `config.valueFromProps`, `config.shouldParcelUpdateFromProps` and `config.onChange` on the top level configuration object are ignored.
