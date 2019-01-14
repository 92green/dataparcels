import Link from 'component/Link';
import {Link as HtmlLink} from 'dcme-style';

# Parcel Types

Each parcel has one or more parcel types that are determined by the kind of data it contains.
Any parcel can be more than one type at once.

You can check a parcel's type by using their <Link to="/api/Parcel#type_methods">type methods</Link>.

Parcel's can contain any type of value you like, but only a subset of these values will give you the ability to edit child values. A parcel with the ability to edit child values will be of type <HtmlLink href={`#ParentParcel`}>ParentParcel</HtmlLink>.

- <HtmlLink href={`#ParentParcel`}>ParentParcel</HtmlLink>
- <HtmlLink href={`#ChildParcel`}>ChildParcel</HtmlLink>
- <HtmlLink href={`#IndexedParcel`}>IndexedParcel</HtmlLink>
- <HtmlLink href={`#ElementParcel`}>ElementParcel</HtmlLink>
- <HtmlLink href={`#TopLevelParcel`}>TopLevelParcel</HtmlLink>

### ParentParcel

A parcel is a `ParentParcel` if its value contains editable child values. Child values are considered editable if they are compatible with the [unmutable](http://unmutable.blueflag.codes) data collection library. These value types are currently supported:

- Objects
- Arrays
- Immutable.js Maps
- Immutable.js Lists
- Immutable.js Records

Unmutable guarantees that data is edited immutably, which is very important for dataparcels.

Class instances are not recognised as `ParentParcel`s because there are no guarantees that they are immutable and Unmutable doesn't know how to interact with them.

If you want the ability to edit the child values on a data type not listed, please make a request in the [unmutable issue tracker](http://github.com/blueflag/unmutable/issues).

When a parcel is a parent parcel, it allows the use of <Link to="/api/Parcel#branch_methods">branch methods</Link> and <Link to="/api/Parcel#parent_methods">parent methods</Link>.

### ChildParcel

A parcel is a `ChildParcel` if it contains a child value from a parent parcel. Child parcels are created using branching methods.

When a parcel is a child parcel, it allows the use of <Link to="/api/Parcel#child_methods">child methods</Link>.

### IndexedParcel

A parcel is an `IndexedParcel` if it contains an indexed data type, such as an array or an Immutable.js List. IndexedParcels are also always parent parcels.

When a parcel is an indexed parcel, it allows the use of <Link to="/api/Parcel#indexed_&_element_change_methods">indexed methods</Link>.

### ElementParcel

A parcel is an `ElementParcel` if it contains the child value of an indexed parcel.

When a parcel is an element parcel, it allows the use of <Link to="/api/Parcel#indexed_&_element_change_methods">element methods</Link>.

### TopLevelParcel

A parcel is a `TopLevelParcel` if it is not a child parcel. Examples: the parcel provided by a ParcelHoc, or a parcel created with `new Parcel`.
