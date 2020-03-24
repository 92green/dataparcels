import Message from 'component/Message';
import {Link} from 'dcme-style/affordance';

When called on a Parcel with an indexed value, such as an array, this method can accept an `index` or a `key`.
- `index` (number) is used to get a value based off its position. It can also be negative, indicating an offset from the end of the sequence.
- `key` (string) is used to get a specific value by its unique key within the Parcel.

<Message>
    Dataparcels automatically gives unique keys to all elements of an indexed parcel. See <Link to="/parcel-keys">parcel keys</Link> for more info.
</Message>
