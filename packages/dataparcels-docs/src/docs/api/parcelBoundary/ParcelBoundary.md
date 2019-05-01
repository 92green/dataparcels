import Link from 'component/Link';
import Param from 'component/Param';
import ApiPageIcon from 'component/ApiPageIcon';
import IconParcelBoundary from 'content/parcelboundary.gif';
import {Box, Message} from 'dcme-style';

# ParcelBoundary

<ApiPageIcon>{IconParcelBoundary}</ApiPageIcon>

ParcelBoundary is a React component. Its job is to optimise rendering performance, and to optionally control the flow of parcel changes.

Each ParcelBoundary is passed a Parcel. By default the ParcelBoundary uses pure rendering, and will only update when the Parcel's data changes to avoid unnecessary re-rendering.

ParcelBoundaries have an internal buffer that can hold onto changes as they exit the boundary. These are normally released immediately, but also allow for debouncing changes, or putting a hold on all changes so they can be released later. Internally ParcelBoundaries use a [useParcelBuffer](/api/usePaercelBuffer) hook.

```js
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
```

```js
<ParcelBoundary
    parcel={Parcel}
    pure={?boolean}
    forceUpdate={?any[]}
    debounce={?number}
    hold={?boolean}
    modifyBeforeUpdate={?Function|Function[]}
>
    {(parcel, control) => Node}
</ParcelBoundary>
```

<Box modifier="margin">
    <Message>ParcelBoundary is also available as a hook, <Link to="/api/useParcelHook">useParcelHook</Link>.</Message>
</Box>
