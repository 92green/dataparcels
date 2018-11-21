import Link from 'gatsby-link';
import ParcelHocUpdateFromProps from 'examples/ParcelHocUpdateFromProps';
import ParcelHocUpdateFromQueryString from 'examples/ParcelHocUpdateFromQueryString';
prop history
prop location

This example shows how `shouldParcelUpdateFromProps` can be used to control the value in a ParcelHoc from changes in props.

This can be very powerful. You can make a ParcelHoc a slave to state that's held higher up in the React component heirarchy, and still take full advantage of the value editing capabilities that `dataparcels` provides.

<Link to="/api/ParcelHoc#shouldParcelUpdateFromProps">API reference for ParcelHoc.shouldParcelUpdateFromProps</Link>

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

## Updating from query string

This example shows how a ParcelHoc's value can be controlled from the query string using React Router.

<ParcelHocUpdateFromQueryString history={history} location={location} />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import {ParcelBoundary} from 'react-dataparcels';
import ReactRouterQueryStringHoc from './ReactRouterQueryStringHoc';

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

// unmutable composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ReactRouterQueryStringHoc({
        name: "queryString"
    }),
    QueryStringParcelHoc,
    QueryStringEditor
);

```

