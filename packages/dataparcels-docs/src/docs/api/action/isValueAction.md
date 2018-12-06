```flow
isValueAction(): boolean
```

Returns true if the action affects the original parcel's value.

Actions such as `setMeta` do not affect the original parcel's value and are not value actions.
