import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    })
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let postcode = personParcel.getIn(['address', 'postcode']);

    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={firstname}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={lastname}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <label>postcode</label>
        <ParcelBoundary parcel={postcode}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
