import React from 'react';
import {ParcelStateHock, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

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

const PersonParcelHoc = ParcelStateHock({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    }),
    prop: "personParcel"
});

export default PersonParcelHoc(ExampleHoc(PersonEditor));
