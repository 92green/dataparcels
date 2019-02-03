import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import cancel from 'react-dataparcels/cancel';
import ExampleHoc from 'component/ExampleHoc';

const ExampleParcelHoc = ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (/* props */) => ({
        abc: 123,
        def: 123
    })
});

const ExampleEditor = ({exampleParcel}) => {
    return <div>
        <p>Frames: {exampleParcel._frame}</p>
        <ParcelBoundary parcel={exampleParcel.get('abc')} hold>
            {(parcel, {release}) => <div style={{border:'1px solid #ccc', padding: '1rem'}}>
                <p>Frames: {parcel._frame}</p>
                <input type="text" {...parcel.spreadDOM()} />
                <button onClick={release}>Release</button>
            </div>}
        </ParcelBoundary>
        <button onClick={() => exampleParcel.set('abc', 456)}>456</button>
        <ParcelBoundary parcel={exampleParcel.get('def')}>
            {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default ExampleParcelHoc(ExampleHoc(ExampleEditor));
