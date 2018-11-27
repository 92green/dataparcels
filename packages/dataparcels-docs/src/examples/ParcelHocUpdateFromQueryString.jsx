import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import {ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';
import IsRenderingStaticHtml from 'utils/IsRenderingStaticHtml';
import ReactRouterQueryStringHoc from 'react-cool-storage/lib/ReactRouterQueryStringHoc';

import composeWith from 'unmutable/lib/util/composeWith';

const QueryStringParcelHoc = ParcelHoc({
    name: "queryStringParcel",
    valueFromProps: (props) => props.queryString.value,
    onChange: (props) => props.queryString.onChange,
    shouldParcelUpdateFromProps: (prevValue, nextValue, valueFromProps) => {
        return valueFromProps(prevValue) !== valueFromProps(nextValue);
    }
});

const QueryStringEditor = (props) => {
    let {queryStringParcel} = props;
    return <div>
        <label>foo</label>
        <ParcelBoundary parcel={queryStringParcel.get('foo')} debounce={200}>
            {(parcel) => <input type="text" {...parcel.spreadDOM('')} />}
        </ParcelBoundary>

        <label>bar</label>
        <ParcelBoundary parcel={queryStringParcel.get('bar')} debounce={200}>
            {(parcel) => <input type="text" {...parcel.spreadDOM('')} />}
        </ParcelBoundary>
    </div>;
};

export default composeWith(
    ReactRouterQueryStringHoc({
        name: "queryString",
        silent: IsRenderingStaticHtml() // gatsby-specific config to render static html without required globals
    }),
    QueryStringParcelHoc,
    ExampleHoc,
    QueryStringEditor
);
