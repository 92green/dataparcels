import {Box, Message} from 'dcme-style';
import Link from 'component/Link';
import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
modifyBeforeUpdate?: Array<ParcelUpdater>

// updating value - only to be used if shape doesn't change
type ParcelUpdater = (value: any, changeRequest: ChangeRequest) => any;

// updating shape, including meta
type ParcelUpdater = asShape((shape: ParcelShape, changeRequest: ChangeRequest) => any);
type ParcelUpdater = asNodes((nodes: any, changeRequest: ChangeRequest) => any);
```

The `modifyBeforeUpdate` config option allows derived data to be set on the Parcel in the ParcelBoundaryHoc.
Whenever the data in a ParcelBoundaryHoc is about to be initialised or updated in any way, it is passed through all `modifyBeforeUpdate` functions.

Each function in the `modifyBeforeUpdate` array operates just like the `updater` provided to <Link to="/api/Parcel#modifyUp">Parcel.modifyUp()</Link>.

<ValueUpdater />
