import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import IconParcelHoc from 'content/parcelhoc.gif';

# ParcelHoc

<ApiPageIcon>{IconParcelHoc}</ApiPageIcon>

ParcelHoc is a React higher order component. Its job is to provide a parcel as a prop, and to handle how the parcel binds to React props and lifecycle events.

It is recommended that you <Link to="/data-editing">use ParcelHoc</Link>, rather than <Link to="/data-editing#Managing-your-own-Parcel-state">managing your own Parcel state</Link>.

```js
import ParcelHoc from 'react-dataparcels/ParcelHoc';
```

```flow
ParcelHoc({
    name: string,
    valueFromProps: Function,
    shouldParcelUpdateFromProps?: Function,
    onChange?: Function,
    modifyBeforeUpdate: Array<Function>,
    delayUntil?: Function,
    pipe?: Function
    // debugging options
    debugParcel?: boolean
});
```

