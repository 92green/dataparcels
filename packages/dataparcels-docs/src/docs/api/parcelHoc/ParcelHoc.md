import Link from 'component/Link';
import ApiPageIcon from 'component/ApiPageIcon';
import IconParcelHoc from 'assets/parcelhoc.gif';
import {Param} from 'dcme-style';
import {Box, Message} from 'dcme-style';

# ParcelHoc

<ApiPageIcon>{IconParcelHoc}</ApiPageIcon>

<Box modifier="margin">
    <Message>ParcelHoc is <strong>deprecated</strong>, please use <Link to="/api/useParcelForm">useParcelForm</Link> or <Link to="/api/useParcelState">useParcelState</Link>.</Message>
</Box>

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

