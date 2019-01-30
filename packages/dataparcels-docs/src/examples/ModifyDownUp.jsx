import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const PathParcelHoc = ParcelHoc({
    name: "pathParcel",
    valueFromProps: (/* props */) => "abc.def"
});

const PathEditor = (props) => {
    let pathArrayParcel = props
        .pathParcel
        .modifyDown(string => string.split(".")) // turn value into an array on the way down
        .modifyUp(array => array.join(".")); // turn value back into a string on the way up

    return <div>
        {pathArrayParcel.toArray((pathSegmentParcel) => {
            return <ParcelBoundary parcel={pathSegmentParcel} key={pathSegmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => pathArrayParcel.push("")}>Add new path segment</button>
    </div>;
};

export default PathParcelHoc(ExampleHoc(PathEditor));
