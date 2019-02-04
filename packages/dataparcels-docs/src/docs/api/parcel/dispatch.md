import Link from 'component/Link';
import {Box, Link as HtmlLink, Message} from 'dcme-style';

```flow
dispatch(dispatchable: Action|Action[]|ChangeRequest): void
```

The `dispatch()` method is used by Parcels internally to pass a <Link to="/api/ChangeRequest">ChangeRequest</Link> upward to the next Parcel in the chain.
