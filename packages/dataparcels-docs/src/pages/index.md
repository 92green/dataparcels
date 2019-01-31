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

## Features

### 1. Data editing

<Link to="/data-editing">Data editing</Link> is the ability to manipulate data based on user input, in a way that's expressive to code. This includes:
- <Link to="/data-editing#data-traversal">Data traversal</Link>
- <Link to="/data-editing#merging-changes">Merging partial changes</Link> into larger data structures
- <Link to="/data-editing#binding-inputs">Binding data to inputs</Link>
- Methods for working with <Link to="/data-editing#indexed-methods">indexed data types</Link> such as arrays
- <Link to="/data-editing#unique-keying">Automatic unique keying</Link> of array elements
- Ability to <Link to="/data-editing#modify">modify data</Link> from its original format to make it suitable for the UI

### 2. UI behaviour

<Link to="/ui-behaviour">UI behaviour</Link> covers features that help the user interact with the data. This includes:
- <Link to="/ui-behaviour#submit-buttons">Submit buttons</Link> for forms
- <Link to="/ui-behaviour#validation">Validation</Link> on user input
- <Link to="/ui-behaviour#confirmation">Confirmation</Link> on important actions such as deleting
- <Link to="/ui-behaviour#selections">Selections</Link> of one or more items
- <Link to="/ui-behaviour#drag-and-drop">Drag and drop sorting</Link> of arrays of items
- <Link to="/ui-behaviour#debouncing-changes">Debouncing changes</Link> for good application performace
- <Link to="/ui-behaviour#pure-rendering">Pure rendering</Link> for good rendering performace

### 3. Data synchronisation

<Link to="/data-synchronisation">Data synchronisation</Link> is how dataparcels interacts with related pieces of external data. This includes:
- Setting up a <Link to="/data-synchronisation#parcel-as-a-slave">Parcel as a slave</Link> to higher state, such as the query string
- Coping with <Link to="/data-synchronisation#sending-failable-changes">sending failable changes</Link>, such as saving data to a server
- <Link to="/data-synchronisation#caching-unsaved0-changes">Caching unsaved changes</Link>
