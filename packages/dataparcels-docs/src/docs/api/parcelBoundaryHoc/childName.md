import Link from 'component/Link';

```flow
${name}: Parcel
```

ParcelBoundaryHoc's child component will receive a Parcel as a prop, with the name of the prop specified by `config.name`. This parcel is on the "inside" of the parcel boundary, and is able to update independently of the parcel that was passed into the ParcelBoundaryHoc.

If ParcelBoundaryHoc doesn't receive a parcel as a prop at the name indicated by `config.name`, then this child prop will not exist.
