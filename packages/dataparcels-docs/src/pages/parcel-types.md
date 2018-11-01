# Parcel Types

Each parcel has one or more parcel types that are determined by the kind of data it has in its value.

### ParentParcel

A parcel is a parent parcel if its value contains editable child values. Child values are considered editable if they are compatible with the unmutable data collection library. These value types are currently supported.

- Objects
- Arrays
- Immutable.js Maps
- Immutable.js Lists
- Immutable.js Records

Unmutable guarantees that data is edited immutably, which is very important for dataparcels.

If you want the ability to edit the child values on a data type not listed, please make a request in the unmutable issue tracker.

When a parcel is a parent parcel, it allows the use of branching methods.

### ChildParcel
