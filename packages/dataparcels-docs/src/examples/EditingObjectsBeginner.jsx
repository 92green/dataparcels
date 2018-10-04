import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
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
        <input type="text" value={firstname.value} onChange={firstname.onChangeDOM} />

        <label>lastname</label>
        <input type="text" value={lastname.value} onChange={lastname.onChangeDOM} />

        <label>postcode</label>
        <input type="text" value={postcode.value} onChange={postcode.onChangeDOM} />
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
