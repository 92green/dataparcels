import Link from 'gatsby-link';
import ParcelHocUpdateFromProps from 'examples/ParcelHocUpdateFromProps';
import ParcelHocUpdateFromQueryString from 'examples/ParcelHocUpdateFromQueryString';
import {Box, Link as HtmlLink} from 'dcme-style';
prop history
prop location

This example shows how `shouldParcelUpdateFromProps` can be used to control the value in a ParcelHoc from changes in props.

This can be very powerful. You can make a ParcelHoc a slave to state that's held higher up in the React component heirarchy, and still take full advantage of the value editing capabilities that `dataparcels` provides. This also makes it easy to swap out your state storage mechanism with another one later on, without having to refactor any components beneath the ParcelHoc.

<Link to="/api/ParcelHoc#shouldParcelUpdateFromProps">API reference for ParcelHoc.shouldParcelUpdateFromProps</Link>

<Box modifier="marginTopKilo" />

- <HtmlLink href={`#Updating-from-higher-up-state`}>Updating from higher-up state</HtmlLink>
- <HtmlLink href={`#Updating-from-query-string`}>Updating from query string</HtmlLink>

## Updating from higher-up state

This example shows how a ParcelHoc's value can be controlled by external state held in a React component.

When you type in the first input, the higher-up state is updated, and the changes are passed down and adopted by the ParcelHoc, via `config.shouldParcelUpdateFromProps`.

When you type in the second input, the ParcelHoc changes and notifies the higher component of the change, via `config.onChange`. The higher component then updates its own state in response to this.

<ParcelHocUpdateFromProps />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    valueFromProps: (props) => props.name,
    onChange: (props) => (value) => props.onChangeName(value),
    shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => {
        return valueFromProps(prevProps) !== valueFromProps(nextProps);
    }
});

const NameEditor = (props) => {
    let {nameParcel} = props;
    return <div>
        <label>name</label>
        <input type="text" {...nameParcel.spreadDOM()} />
    </div>;
};

const UpdateFromPropsExample = NameParcelHoc(NameEditor);

export default class ParcelHocUpdateFromPropsExample extends React.Component {

    state = {
        name: "George"
    };

    render() {
        let {name} = this.state;
        let onChangeName = (newName) => this.setState({
            name: newName
        });

        return <div>
            <p>Higher-up state: {name}</p>
            <label>edit higher-up state directly</label>
            <input value={name} onChange={(e) => onChangeName(e.currentTarget.value)} />
            <UpdateFromPropsExample
                name={name}
                onChangeName={onChangeName}
            />
        </div>;
    }
}
```

<Box modifier="marginTopMega" />

## Updating from query string

This example shows how a ParcelHoc's value can be controlled from the query string using [react-router](https://github.com/ReactTraining/react-router) and [react-cool-storage](http://github.com/blueflag/react-cool-storage). Because of `react-cool-storage`, any values representable by JSON can be stored in the query string, not just strings.

The same method can be used to allow a ParcelHoc to be controlled by another other source of state, such as URL parameters, localStorage or IndexedDB.

<ParcelHocUpdateFromQueryString history={history} location={location} />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import {ParcelBoundary} from 'react-dataparcels';
import ReactRouterQueryStringHoc from 'react-cool-storage/lib/ReactRouterQueryStringHoc';

import composeWith from 'unmutable/lib/util/composeWith';

const QueryStringParcelHoc = ParcelHoc({
    name: "queryStringParcel",
    valueFromProps: (props) => props.queryString.value,
    onChange: (props) => props.queryString.onChange,
    shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => {
        return valueFromProps(prevProps) !== valueFromProps(nextProps);
    }
});

const QueryStringEditor = (props) => {
    let {queryStringParcel} = props;
    return <div>
        <label>foo</label>
        <ParcelBoundary parcel={queryStringParcel.get('foo')} debounce={200}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>

        <label>bar</label>
        <ParcelBoundary parcel={queryStringParcel.get('bar')} debounce={200}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ReactRouterQueryStringHoc({
        name: "queryString"
    }),
    QueryStringParcelHoc,
    QueryStringEditor
);

```
