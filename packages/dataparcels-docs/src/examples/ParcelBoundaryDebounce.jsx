import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const FoodParcelHoc = ParcelHoc({
    name: "foodParcel",
    initialValue: (/* props */) => ({
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

export default FoodParcelHoc(ExampleHoc(FoodEditor));
