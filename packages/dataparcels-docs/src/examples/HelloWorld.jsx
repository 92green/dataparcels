import React from 'react';
import Parcel, {ParcelStateHock, PureParcel} from 'react-dataparcels';

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <PureParcel parcel={personParcel.get('firstname')} debounce={100}>
            {(firstname) => <div>
                <label>firstname</label>
                <input type="text" {...firstname.spreadDOM()} />
            </div>}
        </PureParcel>
        <PureParcel parcel={personParcel.get('lastname')} debounce={100}>
            {(lastname) => <div>
                <label>lastname</label>
                <input type="text" {...lastname.spreadDOM()} />
            </div>}
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

export default PersonParcelHoc(PersonEditor);
