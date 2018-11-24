import Link from 'gatsby-link';
import ParcelHocUpdateFromProps from 'examples/ParcelHocUpdateFromProps';
import ParcelHocUpdateFromQueryString from 'examples/ParcelHocUpdateFromQueryString';
import ParcelHocUpdateFromQueryStringPartial from 'examples/ParcelHocUpdateFromQueryStringPartial';
import {Box, Link as HtmlLink} from 'dcme-style';
prop history
prop location

This example shows how `shouldParcelUpdateFromProps` can be used to control the value in a ParcelHoc from changes in props.

This can be very powerful. You can make a ParcelHoc a slave to state that's held higher up in the React component heirarchy, and still take full advantage of the value editing capabilities that `dataparcels` provides. This also makes it easy to swap out your state storage mechanism with another one later on, without having to refactor any components beneath the ParcelHoc.

<Link to="/api/ParcelHoc#shouldParcelUpdateFromProps">API reference for ParcelHoc.shouldParcelUpdateFromProps</Link>

<Box modifier="marginTopKilo" />

- <HtmlLink href={`#Updating-from-higher-up-state`}>Updating from higher-up state</HtmlLink>
- <HtmlLink href={`#Updating-from-query-string`}>Updating from query string</HtmlLink>
- <HtmlLink href={`#Updating-parts-of-a-parcel-from-more-than-one-source-of-state`}>Updating parts of a parcel from more than one source of state</HtmlLink>

## Updating from higher-up state

This example shows how a ParcelHoc's value can be controlled by external state held in a React component.

<ParcelHocUpdateFromProps />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    valueFromProps: (props) => props.name,
    onChange: (props) => (value) => props.onChangeName(value),
    shouldParcelUpdateFromProps: (prevValue, nextValue) => prevValue !== nextValue
});

const NameEditor = (props) => {
    let {name, nameParcel} = props;
    return <div>
        <div>Higher-up state: {name}</div>
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

        return <UpdateFromPropsExample
            name={name}
            onChangeName={onChangeName}
        />;
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
    shouldParcelUpdateFromProps: (prevValue, nextValue) => prevValue !== nextValue
});

const QueryStringEditor = (props) => {
    let {queryStringParcel} = props;
    return <div>
        <label>foo</label>
        <ParcelBoundary parcel={queryStringParcel.get('foo')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>

        <label>bar</label>
        <ParcelBoundary parcel={queryStringParcel.get('bar')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
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

<Box modifier="marginTopMega" />

## Updating parts of a parcel from more than one source of state

ParcelHoc also allows parts of its parcel to be controlled by more than one source of state. This example shows how to update two values from in the query string, while another two are held exclusively in the ParcelHoc.

<ParcelHocUpdateFromQueryStringPartial history={history} location={location} />
