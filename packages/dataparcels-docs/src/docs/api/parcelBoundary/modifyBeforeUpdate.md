import {Box, Message} from 'dcme-style';
import Link from 'component/Link';
import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
modifyBeforeUpdate?: Array<ValueUpdater>

type ValueUpdater = (value: any, changeRequest: ChangeRequest) => any;
```

The `modifyBeforeUpdate` prop allows derived data to be set on the Parcel in the ParcelBoundary.
Whenever the data in a ParcelBoundary is about to be initialised or updated in any way, it is passed through all `modifyBeforeUpdate` functions.

Each function in the `modifyBeforeUpdate` array operates just like the `updater` provided to <Link to="/api/Parcel#modifyUp">Parcel.modifyUp()</Link>.

```js

let modifyBeforeUpdate = [
    (value) => ({
        ...value,
        isLong: value.word.length > 15
    })
];

// exampleParcel is a Parcel containing
// {
//    word: "cool",
//    isLong: undefined
//    // ^ this will contain derived data
// }

<ParcelBoundary parcel={exampleParcel} modifyBeforeUpdate={modifyBeforeUpdate}>
    {(exampleParcel) => <input type="text" {...exampleParcel.get('word').spreadDOM()} />}
</ParcelBoundary>

// exampleParcel.value.isLong will always return true if word is longer than 15
```

<ValueUpdater />
