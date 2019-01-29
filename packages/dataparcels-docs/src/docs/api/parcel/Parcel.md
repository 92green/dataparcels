import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelCreateReact from 'docs/notes/ParcelCreateReact.md';
import IconParcel from 'content/parcel.gif';

# Parcel

<ApiPageIcon>{IconParcel}</ApiPageIcon>

Parcel is a data container. Its job is to hold your data, split it into smaller parts, and merge changes back together.

If you're using React, you probably won't be instanciating parcels directly. Please see the <Link to="/getting-started">getting started</Link> page to see how to best use Parcels in a React app.

```js
import Parcel from 'dataparcels';
import Parcel from 'react-dataparcels';
```

```flow
new Parcel({
    value?: any,
    handleChange?: Function
});
```

* <Param name="value" optional type="any" default="undefined" />
  The value you want to put in the Parcel. This value will be changed immutably when change methods are called on the Parcel. The data type of the `value` will determine the type of Parcel that will be created, and will determine which methods you can use to change the value. Please read <Link to="/parcel-types">Parcel types</Link> for more info.
* <Param name="handleChange" optional type="(newParcel: Parcel, changeRequest: ChangeRequest) => void" />
  The `handleChange` function will be called whenever the Parcel's value has been triggered to change. It is passed `newParcel`, a replacement Parcel containing the changes; and `changeRequest`, a <Link to="/api/ChangeRequest">ChangeRequest</Link> that contains details about the change itself.
  
  In `handleChange` you would typically implement logic to replace your current parcel with `newParcel`, but if you're using React you should read <Link to="/getting-started">getting started</Link> to save you the trouble of implementing this yourself.

```js
// creates a Parcel that contains a value of 123
let parcel = new Parcel({
    value: 123,
    handleChange: (newParcel) => {
        // here you can insert logic to replace
        // your existing parcel with the newParcel
    })
});
```
