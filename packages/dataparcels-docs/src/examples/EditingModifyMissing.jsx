import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

function MaybeArrayInput(props) {
    let maybeArrayParcel = props
        .maybeArrayParcel
        .modifyDown(value => value || [])
        // ^ turn value into an array if its missing
        //   so we can always render as though an array exists

    return <div>
        {maybeArrayParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => maybeArrayParcel.push("")}>Add new element</button>
    </div>;
}

export default function MaybeArrayEditor(props) {

    let [maybeArrayParcel] = useParcelState({
        value: undefined
    });

    return exampleFrame({maybeArrayParcel}, <div>
        <h4>Compensating for missing values</h4>
        <p>Prepares values so that editors can remain simple.</p>
        <MaybeArrayInput maybeArrayParcel={maybeArrayParcel} />
    </div>);
}
