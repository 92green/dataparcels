import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelCreateReact from 'docs/notes/ParcelCreateReact.md';
import IconParcel from 'content/parcelshape.gif';

# shape

```js
import shape from 'dataparcels/shape';
import shape from 'react-dataparcels/shape';
```

```flow
shape((parcelShape: ParcelShape) => ParcelShape) => Function;
```

The shape function can be used inside of an updater, such as those passed to [Parcel.update](/api/Parcel#update) or [Parcel.modifyUp](/api/Parcel#modifyUp).

It must be passed a function, which will be passed a [ParcelShape](/api/ParcelShape) and sometimes a [ChangeRequest](/api/ChangeRequest) depending on what the `shape()` function is being passed to.

 See <Link to="/api/ParcelShape">ParcelShape</Link> for more details.

```js
import shape from 'dataparcels/shape';

let parcel = new Parcel({
    value: [1,2,3]
});

let modifiedParcel = parcel.modifyDown(shape(parcelShape => parcelShape
    .push("foo")
    .push("bar")
    .setMeta({
        cool: true
    })
));
```
