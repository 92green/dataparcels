import Link from 'component/Link';
import Param from 'component/Param';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-initialvalue.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';
import IconParcelBoundary from 'content/parcelboundary.gif';
import {Box, Message} from 'dcme-style';

# ParcelBoundaryHoc

ParcelBoundaryHoc is a React higher order component. It's job is to control the flow of parcel changes. It is the higher oder component version of a <Link to="/api/ParcelBoundary">ParcelBoundary</Link>.

Each ParcelBoundaryHoc is given a name, and expects that it will be given Parcel as a prop of the same name.

ParcelBoundaryHocs have an internal action buffer that can hold onto changes as they exit the boundary. These are normally released immediately, but also allow for debouncing changes, or putting a hold on all changes so they can be released later or cancelled.

Unlike <Link to="/api/ParcelBoundary">ParcelBoundary</Link>, it cannot use pure rendering.

```js
import {ParcelBoundaryHoc} from 'react-dataparcels';
```

```js
ParcelBoundaryHoc({
    name: string | (props: *) => string,
    debounce?: number | (props: *) => number,
    hold?: boolean | (props: *) => boolean,
    originalParcelProp?: string | (props: *) => string,
    // debugging options
    debugBuffer?: boolean
});
```

<Box modifier="margin">
    <Message>ParcelBoundaryHoc is also available as a React component, <Link to="/api/ParcelBoundary">ParcelBoundary</Link>.</Message>
</Box>
