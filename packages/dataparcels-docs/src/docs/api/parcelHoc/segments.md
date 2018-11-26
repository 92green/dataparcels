import {Box, Message} from 'dcme-style';
import Link from 'component/Link';

```flow
segments?: Array<ParcelHocSegmentConfig> // optional

type ParcelHocSegmentConfig = {
    valueFromProps: (props: Object) => Object,
    shouldParcelUpdateFromProps?: (prevProps: *, nextProps: *) => boolean, // optional
    onChange?: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void // optional,
    keys?: string[]
};
```

ParcelHoc can allow for some segments of its data to be configured separately. This can allow for a single Parcel to source parts of its top-level value from different sources of data, and potentially be controlled by different sources of state. When using `segments`, the value of the Parcel in the ParcelHoc defaults to an object, and each segment's config will apply to a defined set of keys on that object.

The `keys` ParcelHocSegmentConfig configuration option determines which keys each segment pertains to. A key cannot belong to two different segments at once. If `keys` is not set on a segment, then it affects all keys not mentioned in the other segments.

Each of the configuration options on `ParcelHocSegmentConfig` works like they normally do on ParcelHoc with the following exceptions:

- `valueFromProps` must return an object containing the keys nominated in `keys`. Any extra keys will be ignored. This segment value will be merged onto the parcel's value.
- `onChange` only fires when any of the values in the current segment have changed.

If `segments` is set, `config.valueFromProps` and `config.shouldParcelUpdateFromProps` on the top level configuration object are ignored. `config.onChange` still fires as it normally would, before any of the segment's `onChange` functions do. 
