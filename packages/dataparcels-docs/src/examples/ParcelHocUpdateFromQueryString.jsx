import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import {ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';
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
        <ParcelBoundary parcel={queryStringParcel.get('foo', '')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM()} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>

        <label>bar</label>
        <ParcelBoundary parcel={queryStringParcel.get('bar', '')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM()} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default composeWith(
    ReactRouterQueryStringHoc({
        name: "queryString"
    }),
    QueryStringParcelHoc,
    ExampleHoc,
    QueryStringEditor
);
