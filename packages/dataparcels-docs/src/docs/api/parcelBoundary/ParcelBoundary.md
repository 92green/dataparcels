import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';
import IconParcelBoundary from 'content/icon-parcelboundary0001.png';

# ParcelBoundary

<ApiPageIcon>{IconParcelBoundary}</ApiPageIcon>

ParcelBoundary is a React component. It's job is to optimise rendering performance, and to optionally control the flow of parcel changes.

Each ParcelBoundary is passed a Parcel, and by default the ParcelBoundary will only update when the Parcel's data changes. This avoids unnecessary re-rendering.

There are also options for conditionally stopping changes from propagating out of the ParcelBoundary, which can be used for debounding and buffering changes.

```js
import {ParcelBoundary} from 'react-dataparcels';
```

```js
<ParcelBoundary
    parcel={Parcel}
    debounce={?number}
    hold={?boolean}
    forceUpdate={?Array<*>}
    pure={?boolean}
    debugBuffer={?boolean}
>
    {(parcel, actions) => Node}
</ParcelBoundary>
```
