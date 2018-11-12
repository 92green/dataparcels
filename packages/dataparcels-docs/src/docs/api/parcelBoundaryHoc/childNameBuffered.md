import Link from 'component/Link';

```flow
${name}Buffered: boolean
```

ParcelBoundaryHoc's child component will receive a boolean that indicates if the ParcelBoundaryHoc currently contains changes that it hasn't yet released.

If ParcelBoundaryHoc doesn't receive a parcel as a prop at the name indicated by `config.name`, then this child prop will not exist.
