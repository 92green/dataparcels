import React from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [personParcel, personParcelControl] = useParcelForm({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        }
    });

    let personParcelState = personParcelControl._outerParcel;
    return exampleFrame({personParcelState, personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <button onClick={() => personParcelControl.submit()}>Submit</button>
        <button onClick={() => personParcelControl.reset()}>Reset</button>
    </div>);
}
