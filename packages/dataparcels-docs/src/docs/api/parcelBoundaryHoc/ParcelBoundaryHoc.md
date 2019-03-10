import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import ParcelHocExample from 'pages/examples/parcelhoc-example.md';
import ParcelHocInitialValueFromProps from 'pages/examples/parcelhoc-valuefromprops.md';
import ParcelHocOnChange from 'pages/examples/parcelhoc-onchange.md';
import IconParcelBoundaryHoc from 'content/parcelboundaryhoc.gif';
import {Box, Message} from 'dcme-style';

# ParcelBoundaryHoc

<ApiPageIcon>{IconParcelBoundaryHoc}</ApiPageIcon>

ParcelBoundaryHoc is a React higher order component. Its job is to control the flow of parcel changes. It is the higher order component version of a <Link to="/api/ParcelBoundary">ParcelBoundary</Link>.

Each ParcelBoundaryHoc is given a name, and expects that it will be given Parcel as a prop of the same name.

ParcelBoundaryHocs have an internal action buffer that can hold onto changes as they exit the boundary. These are normally released immediately, but also allow for debouncing changes, or putting a hold on all changes so they can be released later or cancelled.

Unlike <Link to="/api/ParcelBoundary">ParcelBoundary</Link>, it cannot use pure rendering.

```js
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
```

```js
ParcelBoundaryHoc({
    name: string | (props: *) => string,
    debounce?: number | (props: *) => number,
    hold?: boolean | (props: *) => boolean,
    modifyBeforeUpdate: Array<ValueUpdater>,
    onCancel?: Array<(continueCancel: Function) => void>,
    onRelease?: Array<(continueRelease: Function) => void>,
    // debugging options
    debugBuffer?: boolean,
    debugParcel?: boolean
});

type ValueUpdater = (value: any, changeRequest: ChangeRequest) => any;
```

<Box modifier="margin">
    <Message>ParcelBoundaryHoc is also available as a React component, <Link to="/api/ParcelBoundary">ParcelBoundary</Link>.</Message>
</Box>
