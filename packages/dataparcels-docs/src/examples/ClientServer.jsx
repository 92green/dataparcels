import React from 'react';
import composeWith from 'unmutable/lib/util/composeWith';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import ExampleWrapperHoc from 'component/ExampleWrapperHoc';
import ParcelHocInspector from 'component/ParcelHocInspector';
import ParcelBoundaryHocInspector from 'component/ParcelBoundaryHocInspector';

const PersonEditor = (props) => {
    let {personParcel} = props;
    let {release, cancel} = props.personParcelControl;
    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <label>postcode</label>
        <ParcelBoundary parcel={personParcel.getIn(['address', 'postcode'])}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </ParcelBoundary>

        <button onClick={release}>Submit</button>
        <button onClick={cancel}>Cancel</button>
    </div>;
};

export default composeWith(
    ParcelHoc({
        name: "personParcel",
        valueFromProps: () => ({
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        })
    }),
    ParcelHocInspector({
        name: "personParcel"
    }),
    ParcelBoundaryHoc({
        name: "personParcel",
        hold: true
    }),
    ParcelBoundaryHocInspector({
        name: "personParcel"
    }),
    ExampleWrapperHoc({
        title: "PersonEditor"
    }),
    PersonEditor
);
