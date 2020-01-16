import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps",
            address: {
                postcode: "1234"
            }
        }
    });

    return exampleFrame(
        {personParcel},
        <div>
            <label>firstname</label>
            <ParcelBoundary parcel={personParcel.get('firstname')}>
                {(firstname) => <input type="text" {...firstname.spreadInput()} />}
            </ParcelBoundary>

            <label>lastname</label>
            <ParcelBoundary parcel={personParcel.get('lastname')}>
                {(lastname) => <input type="text" {...lastname.spreadInput()} />}
            </ParcelBoundary>

            <label>postcode</label>
            <ParcelBoundary parcel={personParcel.getIn(['address', 'postcode'])}>
                {(postcode) => <input type="text" {...postcode.spreadInput()} />}
            </ParcelBoundary>
        </div>
    );
}
