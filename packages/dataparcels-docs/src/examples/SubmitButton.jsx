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

    let [personParcel, personParcelBuffer] = useParcelBuffer({
        parcel: personParcelState,
        hold: true
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

        <button onClick={() => personParcelBuffer.release()}>Submit</button>
        <button onClick={() => personParcelBuffer.clear()}>Cancel</button>
    </div>);
}
