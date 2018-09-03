import Link from 'gatsby-link';
import {Text} from 'dcme-style';

## What is it?

Dataparcels lets you edit data structures in an extremely flexible, data-centric way.<br />
It lets you traverse your data structures like [Immutable.js](https://facebook.github.io/immutable-js/) does, but with added two-way data binding magic.

You can trigger changes to small parts of your data, and those changes will propagate back up and merge into the original data shape automatically. When your data is held in React state, this can form the basis of almost any interactive user interface you can think of.

It's designed for use with [React](https://reactjs.org/), and comes with components for easy state management and performant rendering. The heirarchical, componentized nature of React fits perfectly with the heirarchical, componentized nature of dataparcels.

<Text modifier="weightKilo"><Link to="/examples/editing-arrays">See an example of dataparcels code in action</Link></Text>.

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a first example.

## API

* <Link to="/api/Parcel">Parcel</Link>
* <Link to="/api/ParcelHoc">ParcelHoc</Link>
* <Link to="/api/PureParcel">PureParcel</Link>
* <Link to="/api/ChangeRequest">ChangeRequest</Link>
* <Link to="/api/Action">Action</Link>
* <Link to="/api/ActionCreators">ActionCreators</Link>

## Examples

### Parcel

* <Link to="/examples/editing-objects">Editing Objects</Link>
* <Link to="/examples/editing-arrays">Editing Arrays</Link>
* <Link to="/examples/managing-your-own-parcel-state">Managing Your Own Parcel State</Link>

### ParcelHoc

* <Link to="/examples/parcelhoc-example">ParcelHoc - Example</Link>
* <Link to="/examples/parcelhoc-initialvalue">ParcelHoc - Getting initialValue from props</Link>
* <Link to="/examples/parcelhoc-onchange">ParcelHoc - Using onChange</Link>
* <Link to="/examples/parcelhoc-delayuntil">ParcelHoc - Using delayUntil</Link>

## Features

- Makes editing parts of data shapes <Link to="/examples/editing-objects">really easy</Link>.
- Provides many common methods for <Link to="/examples/editing-arrays">editing arrays of items</Link>, like `push()`, `insert()` and `swap()`.
- Integrates with React seamlessly with higher order components to hold Parcels in state, and pure rendering components to keep rendering fast.
- Changes are immutable, and you can choose what happens when changes occur.
- Array elements are uniquely keyed automatically, which makes it trivial to use array editing animation packages like <a target="_blank" href="https://github.com/joshwcomeau/react-flip-move">react-flip-move</a>.
- Meta data can be easily stored against different locations in your data shape. For example, keeping track of the original value of each field in an object.
