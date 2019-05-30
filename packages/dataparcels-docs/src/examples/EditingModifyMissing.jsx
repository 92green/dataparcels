import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function MaybeArrayEditor(props) {

    let [maybeArrayParcel] = useParcelState({
        value: undefined
    });

    maybeArrayParcel = maybeArrayParcel.modifyDown(value => value || [])
    // ^ turn value into an array if its missing
    //   so we can always render as though an array exists

    return exampleFrame({maybeArrayParcel}, <div>
        {maybeArrayParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => maybeArrayParcel.push("")}>Add new element</button>
    </div>);
}
