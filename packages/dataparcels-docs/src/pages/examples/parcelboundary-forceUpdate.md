import Link from 'gatsby-link';
import ParcelBoundaryForceUpdate from 'examples/ParcelBoundaryForceUpdate';

This example demonstrates ParcelBoundary's `forceUpdate` feature. The `options` array loads shortly after the components mount and the parcel is created. ParcelBoundaries use pure rendering by default, so it will not normally update when the contents of the `options` prop changes.

The `forceUpdate` option is used to force the ParcelBoundary to update when `options` changes.

<Link to="/api/ParcelBoundary#forceUpdate">API reference for ParcelBoundary.forceUpdate</Link>

<ParcelBoundaryForceUpdate />

```js
import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

const ColourParcelHoc = ParcelHoc({
    name: "colourParcel",
    valueFromProps: (/* props */) => "Option A"
});

const ColourEditor = (props) => {
    let {colourParcel, options} = props;
    return <div>
        <label>favourite colour</label>
        <ParcelBoundary parcel={colourParcel} forceUpdate={[options]}>
            {(mains) => <select {...mains.spreadDOM()}>
                {options.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
            </select>}
        </ParcelBoundary>
    </div>;
};

export default ColourParcelHoc(ColourEditor);

```
