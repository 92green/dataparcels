import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import ExampleHoc from 'component/ExampleHoc';
import composeWith from 'unmutable/composeWith';

const PersonEditor = (props) => {
    let {personParcel, personParcelControl} = props;
    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ParcelHoc({
        name: "personParcel",
        valueFromProps: (/* props */) => ({
            firstname: "Robert",
            lastname: "Clamps"
        })
    }),
    ExampleHoc,
    ParcelBoundaryHoc({
        name: "personParcel",
        debounce: 500  // hold onto changes until 500ms have elapsed since last change
    }),
    PersonEditor
);
