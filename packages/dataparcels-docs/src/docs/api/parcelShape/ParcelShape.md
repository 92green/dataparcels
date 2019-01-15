import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelCreateReact from 'docs/notes/ParcelCreateReact.md';
import IconParcel from 'content/parcel.gif';

# ParcelShape

<ApiPageIcon>{IconParcel}</ApiPageIcon>

ParcelShape is a data container very similar to a <Link to="/api/Parcel">Parcel</Link> but without the automatic data binding. All it does is contain data, no strings attached, and provide methods for you to alter its data.

These exist to be used with <Link to="/shape-updaters">shape updaters</Link>, to provide a safe way to alter the shape of data in a Parcel.
ParcelShape's methods are a subset of <Link to="/api/Parcel">Parcel</Link>'s methods.

```js
import {ParcelShape} from 'dataparcels';
import {ParcelShape} from 'react-dataparcels';
```

```flow
new ParcelShape(value?: any);
```

* <Param name="value" optional type="any" default="undefined" />
  The value you want to put in the ParcelShape. This value will be changed immutably when change methods are called on the ParcelShape. The data type of the `value` will determine the type of ParcelShape that will be created, and will determine which methods you can use to change the value. Please read <Link to="/parcel-types">Parcel types</Link> for more info.

```js
// creates a Parcel that contains a value of 123
let parcelShape = new ParcelShape(123);
```

## Example Usage

ParcelShapes are used in a very similar way to [Immutable.js Maps and Lists](https://facebook.github.io/immutable-js/docs/), by calling methods that return new and updated ParcelShapes.

TODO
