import Link from 'gatsby-link';

# Dataparcels

Dataparcels lets you easily build UIs for editing data structures.

1. Put your data in a `Parcel`.
2. Access pieces of your data shape using `Parcel` methods, and render inputs for these as you wish.
3. Changes triggered by these inputs are merged into the original data shape.
4. Build forms, search filters, anything with data-backed user interaction.

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a first example.

## Features

- Makes editing parts of data shapes <Link to="/examples/editing-objects">really easy</Link>.
- Provides many common methods for <Link to="/examples/editing-arrays">editing arrays of items</Link>, like `push()`, `insert()` and `swap()`.
- Integrates with React seamlessly with higher order components to hold Parcels in state, and pure rendering components to keep rendering fast.
- Changes are immutable, and you can choose what happens when changes occur.
- Array elements are uniquely keyed automatically, which makes it trivial to use array editing animation packages like <a target="_blank" href="https://github.com/joshwcomeau/react-flip-move">react-flip-move</a>.
- Meta data can be easily stored against different locations in your data shape. For example, keeping track of the original value of each field in an object.

## API

* <Link to="/api/Parcel">Parcel</Link>
* <Link to="/api/PureParcel">PureParcel</Link>
* <Link to="/api/ParcelStateHoc">ParcelStateHoc</Link>
* <Link to="/api/ChangeRequest">ChangeRequest</Link>
* <Link to="/api/Action">Action</Link>
* <Link to="/api/ActionCreators">ActionCreators</Link>

## Examples

* <Link to="/examples/editing-objects">Editing Objects</Link>
* <Link to="/examples/editing-arrays">Editing Arrays</Link>
* <Link to="/examples/managing-your-own-parcel-state">Managing Your Own Parcel State</Link>
* <Link to="/examples/parcelstatehoc-example">ParcelStateHoc - Example</Link>
* <Link to="/examples/parcelstatehoc-initial-value-from-props">ParcelStateHoc - Getting initialValue from props</Link>
* <Link to="/examples/parcelstatehoc-onchange">ParcelStateHoc - Using onChange</Link>

