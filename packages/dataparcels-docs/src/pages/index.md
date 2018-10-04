import Link from 'gatsby-link';
import API from 'content/API';
import {Divider, Grid, GridItem, Text} from 'dcme-style';
import Examples from 'content/Examples.md';

## What is it?

Dataparcels lets you edit data structures in an extremely flexible, data-centric way.<br />
It lets you traverse your data structures like [Immutable.js](https://facebook.github.io/immutable-js/) does, but with added two-way data binding magic.

You can trigger changes to small parts of your data, and those changes will propagate back up and merge into the original data shape automatically. When your data is held in React state, this can form the basis of almost any interactive user interface you can think of.

It's designed for use with [React](https://reactjs.org/), and comes with components for easy state management and performant rendering. The heirarchical, componentized nature of React fits perfectly with the heirarchical, componentized nature of dataparcels.

<Text modifier="weightKilo"><Link to="/examples/editing-arrays">See an example of dataparcels code in action</Link></Text>.

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a first example.

## Examples

<Examples />
