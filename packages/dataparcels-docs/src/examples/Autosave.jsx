import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import useParcelBuffer from 'react-dataparcels/useParcelBuffer';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [personParcelState] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        }
    });

    let [personParcel] = useParcelBuffer({
        parcel: personParcelState,
        debounce: 500  // hold onto changes until 500ms have elapsed since last change
    });

    return exampleFrame({personParcelState, personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>
    </div>);
}

