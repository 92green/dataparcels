import Link from 'gatsby-link';
import API from 'content/API';
import {Divider, Grid, GridItem, Text} from 'dcme-style';

## What is it?

Dataparcels lets you edit data structures in an extremely flexible, data-centric way.<br />
It lets you traverse your data structures like [Immutable.js](https://facebook.github.io/immutable-js/) does, but with added two-way data binding magic.

You can trigger changes to small parts of your data, and those changes will propagate back up and merge into the original data shape automatically. When your data is held in React state, this can form the basis of almost any interactive user interface you can think of.

It's designed for use with [React](https://reactjs.org/), and comes with components for easy state management and performant rendering. The heirarchical, componentized nature of React fits perfectly with the heirarchical, componentized nature of dataparcels.

<Text modifier="weightKilo"><Link to="/data-editing">See an example of dataparcels code in action</Link></Text>.

<Divider />

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a first example.

<Divider />

## Features

### 1. Data editing

<Link to="/data-editing">Data editing</Link> is the ability to manipulate data based on user input, in a way that's expressive to code. This includes:
- <Link to="/data-editing">Data traversal</Link>
- <Link to="/data-editing">Binding data to inputs</Link>
- <Link to="/data-editing">Merging partial changes</Link> into larger data structures
- Methods for working with <Link to="/data-editing#Indexed-data-types">indexed data types</Link> such as arrays
- <Link to="/data-editing#Indexed-data-types">Automatic unique keying</Link> of array elements
- Ability to <Link to="/data-editing#Modifying-data-to-fit-the-UI">modify data to fit the UI</Link>
- Setting <Link to="/data-editing#Derived-data">derived data</Link> based on other data
- <Link to="/data-editing#Fields-that-interact-with-each-other">Fields that interact with each other</Link>
- <Link to="/data-editing#Managing-your-own-Parcel-state">Managing your own Parcel state</Link>

### 2. UI behaviour

<Link to="/ui-behaviour">UI behaviour</Link> covers features that help the user interact with the data. This includes:
- <Link to="/ui-behaviour#Submit-buttons">Submit buttons</Link> for forms 🚧
- <Link to="/ui-behaviour#Validation">Validation</Link> on user input 🚀 🚧
- <Link to="/ui-behaviour#Confirmation">Confirmation</Link> on important actions such as deleting 🚧
- <Link to="/ui-behaviour#Selections">Selections</Link> of one or more items 🚧
- <Link to="/ui-behaviour#Drag-and-drop">Drag and drop sorting</Link> of arrays of items
- <Link to="/ui-behaviour#Debouncing-changes">Debouncing changes</Link> for improved performance
- <Link to="/ui-behaviour#Pure-rendering">Pure rendering</Link> for improved rendering performance

### 3. Data synchronisation

<Link to="/data-synchronisation">Data synchronisation</Link> encompasses how dataparcels interacts with pieces of data stored externally. This includes:
- Setting up a <Link to="/data-synchronisation#ParcelHoc-as-a-slave">ParcelHoc as a slave</Link> to higher state, such as the query string 🚧
- Coping with <Link to="/data-synchronisation#Sending-failable-requests">sending failable requests</Link>, such as saving data to a server 🚧
- <Link to="/data-synchronisation#Sending-partial-requests">Sending partial requests</Link>, such as making requests to save individual items in a list 🚧
- <Link to="/data-synchronisation#Caching-unsaved-changes">Caching unsaved changes</Link> so data is not lost if it is not yet saved and the page unloads 🚧
- How to <Link to="/data-synchronisation#Retaining-Parcel-keys">retain Parcel keys</Link>, so a ParcelHoc can change its value via props, and unsaved changes will still be able to apply to the right pieces of data 🚧


<p className="Text Text-small Text-emphasis">🚧 indicates that either the feature or example is still in development</p>
<p className="Text Text-small Text-emphasis">🚀 indicates a priority feature</p>

<Divider />
