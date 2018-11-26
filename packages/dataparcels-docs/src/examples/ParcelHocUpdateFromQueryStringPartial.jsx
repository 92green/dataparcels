import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import {ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';
import IsRenderingStaticHtml from 'utils/IsRenderingStaticHtml';
import ReactRouterQueryStringHoc from 'react-cool-storage/lib/ReactRouterQueryStringHoc';

import composeWith from 'unmutable/lib/util/composeWith';

const QueryStringParcelHoc = ParcelHoc({
    name: "exampleParcel",
    segments: [
        {
            // update foo and bar from query string
            valueFromProps: (props) => props.queryString.value,
            onChange: (props) => props.queryString.onChange,
            shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => {
                return valueFromProps(prevProps) !== valueFromProps(nextProps);
            },
            keys: ['foo', 'bar']
        },
        {
            // all remaining (baz and fuzz) will get value from this
            valueFromProps: (props) => ({
                baz: "baz",
                fuzz: "fuzz"
            }),
            onChange: (props) => (value) => console.log("value", value)
        }
    ]
});

const QueryStringEditor = (props) => {
    let {exampleParcel} = props;

    return <div>
        <label>foo</label>
        <ParcelBoundary parcel={exampleParcel.get('foo')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>

        <label>bar</label>
        <ParcelBoundary parcel={exampleParcel.get('bar')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>

        <label>baz</label>
        <ParcelBoundary parcel={exampleParcel.get('baz')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
        </ParcelBoundary>

        <label>fuzz</label>
        <ParcelBoundary parcel={exampleParcel.get('fuzz')} debounce={200}>
            {(parcel) => <div>
                <input type="text" {...parcel.spreadDOM('')} />
                <button onClick={() => parcel.delete()}>x</button>
            </div>}
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
