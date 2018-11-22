# Parcel Types

Each parcel has one or more parcel types that are determined by the kind of data it contains.
Any parcel can be more than one type at once.

### ParentParcel

A parcel is a parent parcel if its value contains editable child values. Child values are considered editable if they are compatible with the [unmutable](http://github.com/blueflag/unmutable) data collection library. These value types are currently supported:

- Objects
- Arrays
- Immutable.js Maps
- Immutable.js Lists
- Immutable.js Records

Unmutable guarantees that data is edited immutably, which is very important for dataparcels.

If you want the ability to edit the child values on a data type not listed, please make a request in the  [unmutable issue tracker](http://github.com/blueflag/unmutable/issues).

When a parcel is a parent parcel, it allows the use of branching methods.

### ChildParcel

A parcel is a child parcel if it contains a child value from a parent parcel. Child parcels are created using branhing methods.

When a parcel is a child parcel, it allows the use of child methods.

### IndexedParcel

A parcel is an indexed parcel if it contains an indexed data type, such as an array or an Immutable.js List. IndexedParcels are also always parent parcels.

When a parcel is an indexed parcel, it allows the used of indexed methods.

### ElementParcel

A parcel is an element parcel if it contains the child value of an indexed parcel.

When a parcel is an element parcel, it allows th 
