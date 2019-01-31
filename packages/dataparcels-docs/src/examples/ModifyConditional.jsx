import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const AgeParcelHoc = ParcelHoc({
    name: "ageParcel",
    valueFromProps: (/* props */) => 22
});

const NameEditor = (props) => {
    let ageParcel = props
        .ageParcel
        .modifyDown(number => `${number}`)
        // .modifyShapeUp(parcelShape => {
        //     let updated = parcelShape.update(string => Number(string));
        //     return isNaN(updated.value) ? undefined : updated;
        // });
        // .modifyChange((parcel, changeRequest) => {
        //     let string = changeRequest.nextData.value;
        //     let updated = Number(string);
        //     if(!isNaN(updated)) {
        //         parcel.set(updated);
        //     }
        // })

    return <div>
        <label>age</label>
        <ParcelBoundary parcel={ageParcel}>
            {(ageParcel) => <input type="text" {...ageParcel.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default AgeParcelHoc(ExampleHoc(NameEditor));
