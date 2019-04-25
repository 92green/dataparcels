import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

function DelimitedStringInput(props) {
    let delimitedStringParcel = props
        .delimitedStringParcel
        .modifyDown(string => string.split("."))
        //  ^ turn value into an array on the way down
        .modifyUp(array => array.join("."));
        // ^ turn value back into a string on the way up

    return <div>
        {delimitedStringParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => delimitedStringParcel.push("")}>Add new path segment</button>
    </div>;
}

export default function DelimitedStringEditor(props) {

    let [delimitedParcel] = useParcelState({
        value: "abc.def"
    });

    return exampleFrame({delimitedParcel}, <div>
        <h4>Delimited string > array of strings</h4>
        <p>Turns a stored string into an array so array editing controls can be rendered.</p>
        <DelimitedStringInput delimitedStringParcel={delimitedParcel} />
    </div>);
}
