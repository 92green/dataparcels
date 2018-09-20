import Link from 'gatsby-link';
import API from 'content/API';
import {Divider, Grid, GridItem, Text} from 'dcme-style';

## What is it?

Dataparcels lets you edit data structures in an extremely flexible, data-centric way.<br />
It lets you traverse your data structures like [Immutable.js](https://facebook.github.io/immutable-js/) does, but with added two-way data binding magic.

You can trigger changes to small parts of your data, and those changes will propagate back up and merge into the original data shape automatically. When your data is held in React state, this can form the basis of almost any interactive user interface you can think of.

It's designed for use with [React](https://reactjs.org/), and comes with components for easy state management and performant rendering. The heirarchical, componentized nature of React fits perfectly with the heirarchical, componentized nature of dataparcels.

<Text modifier="weightKilo"><Link to="/examples/editing-arrays">See an example of dataparcels code in action</Link></Text>.

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a first example.

## Examples

### Parcel

* <Link to="/examples/editing-objects">Editing Objects</Link>
* <Link to="/examples/editing-arrays">Editing Arrays</Link>
* <Link to="/examples/managing-your-own-parcel-state">Managing Your Own Parcel State</Link>

### ParcelHoc

* <Link to="/examples/parcelhoc-example">ParcelHoc Example</Link>
* <Link to="/examples/parcelhoc-initialvalue">Getting initialValue from props</Link>
* <Link to="/examples/parcelhoc-onchange">Using onChange</Link>
* <Link to="/examples/parcelhoc-delayuntil">Using delayUntil</Link>


