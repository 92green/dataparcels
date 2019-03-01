import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const ExampleParcelHoc = ParcelHoc({
    name: "maybeArrayParcel",
    valueFromProps: (/* props */) => undefined
});

const MaybeArrayInput = (props) => {
    let maybeArrayParcel = props
        .maybeArrayParcel
        .modifyDown(value => value || [])
        // ^ turn value into an array if its missing
        //   so we can always render against an array

    return <div>
        {maybeArrayParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => maybeArrayParcel.push("")}>Add new element</button>
    </div>;
};

const MaybeArrayEditor = (props) => {
    let {maybeArrayParcel} = props;
    return <div>
        <h4>Compensating for missing values</h4>
        <p>Prepares values so that editors can remain simple.</p>
        <MaybeArrayInput maybeArrayParcel={maybeArrayParcel} />
    </div>;
};

export default ExampleParcelHoc(ExampleHoc(MaybeArrayEditor));
