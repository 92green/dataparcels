import React from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [personParcel, personParcelControl] = useParcelForm({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        },
        debounce: 500  // hold onto changes until 500ms have elapsed since last change
    });

    let personParcelState = personParcelControl._outerParcel;
    return exampleFrame({personParcelState, personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadInput()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadInput()} />}
        </ParcelBoundary>
    </div>);
}

