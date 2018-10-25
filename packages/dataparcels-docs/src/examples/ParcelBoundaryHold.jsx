import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    valueFromProps: (/* props */) => "Gregor"
});

const FoodEditor = (props) => {
    let {nameParcel} = props;
    return <div>
        <label>name</label>
        <ParcelBoundary parcel={nameParcel} hold debugBuffer>
            {(nameParcel, {release, cancel}) => <div>
                <input type="text" {...nameParcel.spreadDOM()} />
                <button onClick={() => release()}>Submit</button>
                <button onClick={() => cancel()}>Cancel</button>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default NameParcelHoc(ExampleHoc(FoodEditor));
