import Link from 'gatsby-link';

# Dataparcels

Dataparcels lets you easily build UIs for editing data structures.

1. Put your data in a `Parcel`.
2. Access pieces of your data shape using `Parcel` methods, and render inputs for these as you wish.
3. Changes triggered by these inputs are merged into the original data shape.
4. Build forms, search filters, anything with data-backed user interaction.

### Add lots of examples!

## Getting Started

<Link to="/getting-started">Get started with dataparcels</Link>, installation instructions and a hello world example.

## Features

- Integrates with React seamlessly with higher order components to hold Parcels in state, and pure rendering components to keep rendering fast.
- Changes are immutable, and you can choose what happens when changes occur.
- `Parcel`s can be used with whatever state container you like. Works well with <a target="_blank" href="https://redux.js.org/">redux</a>, React component state, or data stored in the query string for example.
- Provides many common methods for editing arrays of items, like `push()`, `insert()` and `swap()`.
- Array elements are uniquely keyed automatically, which makes it 100% compatible with packages like <a target="_blank" href="https://github.com/joshwcomeau/react-flip-move">react-flip-move</a> with no set up required.
- Meta data can be easily stored against different locations in your data shape. For example, keeping track of the original value 

## API

* <Link to="/api/Parcel">Parcel</Link>
