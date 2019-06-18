import React from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

const initialValue = {
    firstname: "",
    lastname: ""
};

export default function SignUpForm(props) {

    let [requestState, setRequestState] = useState("idle");
    let rejectRef = useRef(() => {});

    let saveMyData = () => new Promise((resolve, reject) => {
        setRequestState("pending...");

        let timeout = setTimeout(() => {
            setRequestState("resolved");
            resolve();
        }, 2000);

        rejectRef.current = () => {
            setRequestState("rejected");
            clearTimeout(timeout);
            reject();
        };
    });

    let [personParcel, personParcelControl] = useParcelForm({
        value: initialValue,
        onChange: async (parcel) => {
            await saveMyData(parcel.value);
            return initialValue;
        },
        onChangeUseResult: true
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

        <p>Request state: <strong>{requestState}</strong>
            {requestState === "pending..." && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}
