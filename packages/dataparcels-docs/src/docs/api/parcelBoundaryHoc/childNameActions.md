import Link from 'component/Link';

```flow
${name}Actions: {release: () => void, cancel: () => void}
```

ParcelBoundaryHoc's child component will receive a set of actions that can be used to control the ParcelBoundaryHoc's action buffer.

If ParcelBoundaryHoc doesn't receive a parcel as a prop at the name indicated by `config.name`, then this child prop will not exist.
