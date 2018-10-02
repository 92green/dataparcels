import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';
import IconParcelBoundary from 'content/parcelboundary.gif';

# ParcelBoundary

<ApiPageIcon>{IconParcelBoundary}</ApiPageIcon>

ParcelBoundary is a React component. It's job is to optimise rendering performance, and to optionally control the flow of parcel changes.

Each ParcelBoundary is passed a Parcel. By default the ParcelBoundary uses pure rendering, and will only update when the Parcel's data changes to avoid unnecessary re-rendering.

ParcelBoundaries have an internal action buffer that can hold onto changes as they exit the boundary. These are normally released immediately, but also allow for debouncing changes, or putting a hold on all changes so they can be released later.

```js
import {ParcelBoundary} from 'react-dataparcels';
```

```js
<ParcelBoundary
    parcel={Parcel}
    debounce={?number}
    pure={?boolean}
    forceUpdate={?Array<*>}
    hold={?boolean}
    debugBuffer={?boolean}
>
    {(parcel, actions) => Node}
</ParcelBoundary>
```
