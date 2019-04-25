import React from 'react';
import {useState} from 'react';
import Parcel from 'react-dataparcels';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';

export default function ManagingOwnParcelState(props) {

    let [personParcel, setPersonParcel] = useState(() => new Parcel({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        },
        handleChange: (parcel) => {
            setPersonParcel(parcel);
        }
    }));

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
}
