import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelCreateReact from 'docs/notes/ParcelCreateReact.md';
import IconParcel from 'content/parcel.gif';

# StaticParcel

<ApiPageIcon>{IconParcel}</ApiPageIcon>

StaticParcel is a data container very similar to a <Link to="/api/Parcel">Parcel</Link> but without the automatic data binding. All it does is contain data, no strings attached, and provide methods for you to alter it's data.

These exist to be used with <Link to="/deep-updaters">deep updaters</Link>, to provide a safe way to alter the shape of data in a Parcel.
Its methods a subset of <Link to="/api/Parcel">Parcel</Link>'s methods.

```js
import {StaticParcel} from 'dataparcels';
import {StaticParcel} from 'react-dataparcels';
```

```flow
new StaticParcel(value?: any);
```

* <Param name="value" optional type="any" default="undefined" />
  The value you want to put in the StaticParcel. This value will be changed immutably when change methods are called on the StaticParcel. The data type of the `value` will determine the type of StaticParcel that will be created, and will determine which methods you can use to change the value. Please read <Link to="/parcel-types">Parcel types</Link> for more info.

```js
// creates a Parcel that contains a value of 123
let staticParcel = new StaticParcel(123);
```

## Example Usage

StaticParcels are used in a very similar way to (Immutable.js Maps and Lists)[https://facebook.github.io/immutable-js/docs/], by calling methods that return new and updated StaticParcels.

TODO
