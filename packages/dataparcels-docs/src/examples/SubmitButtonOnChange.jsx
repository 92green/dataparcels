import React from 'react';
import {useRef} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

const initialValue = {
    firstname: "",
    lastname: ""
};

export default function SignUpForm(props) {

    let rejectRef = useRef(() => {});

    let saveMyData = () => new Promise((resolve, reject) => {

        let timeout = setTimeout(resolve, 2000);

        rejectRef.current = () => {
            clearTimeout(timeout);
            reject(); // "rejected"
        };
    });

    let [personParcel, personParcelControl] = useParcelForm({
        value: initialValue,
        onSubmit: (parcel) => saveMyData(parcel.value)
        // ^ returns a promise
    });

    let personParcelState = personParcelControl._outerParcel;
    return exampleFrame({personParcelState, personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <input type="text" {...firstname.spreadDOM()} />}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <input type="text" {...lastname.spreadDOM()} />}
        </ParcelBoundary>

        <button onClick={() => personParcelControl.submit()}>Submit</button>

        <p>Request state: <strong>{personParcelControl.submitStatus.status}</strong>
            {personParcelControl.submitStatus.isPending && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}
