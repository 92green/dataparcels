import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function AlphanumericEditor(props) {
    let [alphanumericParcel] = useParcelState({
        value: "Abc123"
    });

    return exampleFrame({alphanumericParcel}, <ParcelBoundary parcel={alphanumericParcel}>
        {(alphanumericParcel) => {
            let parcel = alphanumericParcel.modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
            // ^ remove non alpha numeric characters on the way up
            return <input type="text" {...parcel.spreadInput()} />;
        }}
    </ParcelBoundary>);
}
