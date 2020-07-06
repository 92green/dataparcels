import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

const withOriginalMeta = (parcel) => parcel.initialMeta({
    original: parcel.value
});

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            firstname: "Robert",
            lastname: "Clamps"
        }
    });

    let firstname = personParcel
        .get('firstname')
        .pipe(withOriginalMeta);

    let lastname = personParcel
        .get('lastname')
        .pipe(withOriginalMeta);

    return exampleFrame({personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={firstname}>
            {(firstname) => <div>
                <input type="text" {...firstname.spreadInput()} />
                <div className="Text Text-right">Changed? {firstname.meta.original === firstname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={lastname}>
            {(lastname) => <div>
                <input type="text" {...lastname.spreadInput()} />
                <div className="Text Text-right">Changed? {lastname.meta.original === lastname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>
    </div>);
}
