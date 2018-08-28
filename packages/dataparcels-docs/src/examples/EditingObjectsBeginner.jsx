import React from 'react';
import {ParcelStateHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelStateHoc({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps",
        address: {
            postcode: "1234"
        }
    }),
    prop: "personParcel"
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel.get('firstname');
    let lastname = personParcel.get('lastname');
    let postcode = personParcel.getIn(['address', 'postcode']);

    return <div>
        <label>firstname</label>
        <input type="text" value={firstname.value} onChange={firstname.onChange} />

        <label>lastname</label>
        <input type="text" value={lastname.value} onChange={lastname.onChange} />

        <label>postcode</label>
        <input type="text" value={postcode.value} onChange={postcode.onChange} />
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
