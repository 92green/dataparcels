import Link from 'component/Link';
import Param from 'component/Param';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';

# ParcelHoc

ParcelHoc is a higher order component that creates a Parcel on mount, stores it in its own state, and passes the Parcel down as props. It abstracts away most of the binding between a Parcel and the lifecycle methods of a React component.

It is recommended that you <Link to="/examples/editing-objects">use ParcelHoc</Link>, rather than <Link to="/examples/managing-your-own-parcel-state">managing your own Parcel state</Link>.

```js
import {ParcelHoc} from 'react-dataparcels';
```

```flow
ParcelHoc({
    name: string,
    initialValue?: Function,
    delayUntil?: Function,
    onChange?: Function,
    pipe?: Function
    // debugging options
    debugRender?: boolean
});
```
