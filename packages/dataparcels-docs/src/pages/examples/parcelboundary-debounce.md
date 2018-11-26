import Link from 'gatsby-link';
import ParcelBoundaryDebounce from 'examples/ParcelBoundaryDebounce';

This example demonstrates ParcelBoundary's `debounce` feature. The first field is debounced. It is slower to update state, and updates less often which causes less re-renders to happen.

<Link to="/api/ParcelBoundary#debounce">API reference for ParcelBoundary.debounce</Link>

<ParcelBoundaryDebounce />

```js
import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';

const FoodParcelHoc = ParcelHoc({
    name: "foodParcel",
    valueFromProps: (/* props */) => ({
        mains: "Soup",
        dessert: "Strudel"
    })
});

const FoodEditor = (props) => {
    let {foodParcel} = props;
    return <div>
        <label>mains (with 300ms debounce)</label>
        <ParcelBoundary parcel={foodParcel.get('mains')} debounce={300}>
            {(mains) => <input type="text" {...mains.spreadDOM()} />}
        </ParcelBoundary>

        <label>dessert (without debounce)</label>
        <ParcelBoundary parcel={foodParcel.get('dessert')}>
            {(dessert) => <input type="text" {...dessert.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default FoodParcelHoc(FoodEditor);

```
