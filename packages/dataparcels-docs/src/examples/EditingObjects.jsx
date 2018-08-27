import React from 'react';
import {ParcelStateHoc, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelStateHoc({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    }),
    prop: "personParcel"
});

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <label>firstname</label>
        <PureParcel parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </PureParcel>

        <label>lastname</label>
        <PureParcel parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </PureParcel>
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
