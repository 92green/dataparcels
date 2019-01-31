import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    })
});

const withOriginalMeta = (parcel) => parcel.initialMeta({
    original: parcel.value
});

const PersonEditor = (props) => {
    let {personParcel} = props;

    let firstname = personParcel
        .get('firstname')
        .pipe(withOriginalMeta);

    let lastname = personParcel
        .get('lastname')
        .pipe(withOriginalMeta);

    return <div>
        <label>firstname</label>
        <ParcelBoundary parcel={firstname}>
            {(firstname) => <div>
                <input type="text" {...firstname.spreadDOM()} />
                <div className="Text Text-right">Changed? {firstname.meta.original === firstname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={lastname}>
            {(lastname) => <div>
                <input type="text" {...lastname.spreadDOM()} />
                <div className="Text Text-right">Changed? {lastname.meta.original === lastname.value ? 'No' : 'Yes'}</div>
            </div>}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
