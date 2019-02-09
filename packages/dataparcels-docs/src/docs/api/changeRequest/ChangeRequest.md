import Link from 'component/Link';

# ChangeRequest

```js
import ChangeRequest from 'dataparcels/ChangeRequest';
import ChangeRequest from 'react-dataparcels/ChangeRequest';
```

```flow
new ChangeRequest({
   action: Action|Action[] = []
});
```

When a change occurs, ChangeRequests are used by Parcels to describe what to change and how to change it. These ChangeRequests are propagated upward to the top level Parcel.

ChangeRequests contain an array of actions to perform.

ChangeRequests can most often be accessed in `handleChange` and `modifyUp` functions. Most of the time these operate invisibly, and it's extremely rare that you'll create these yourself.

*This page is currently being written* 🚧
