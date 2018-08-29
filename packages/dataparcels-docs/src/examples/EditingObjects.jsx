import React from 'react';
import {ParcelHoc, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    initialValue: (/* props */) => ({
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
        <PureParcel parcel={firstname}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </PureParcel>

        <label>lastname</label>
        <PureParcel parcel={lastname}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </PureParcel>

        <label>postcode</label>
        <PureParcel parcel={postcode}>
            {(postcode) => <input type="text" {...postcode.spreadDOM()} />}
        </PureParcel>
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
