import React from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import rekey from 'react-dataparcels/rekey';
import exampleFrame from 'component/exampleFrame';

const initialValue = {
    firstname: "",
    lastname: ""
};

export default function SignUpForm(props) {

    let [requestState, setRequestState] = useState("idle");
    let rejectRef = useRef(() => {});

    let saveMyData = (value) => new Promise((resolve, reject) => {
        setRequestState("pending...");

        let timeout = setTimeout(() => {
            setRequestState("resolved");
            resolve(value);
        }, 2000);

        rejectRef.current = () => {
            setRequestState("rejected");
            clearTimeout(timeout);
            reject();
        };
    });

    let [personParcel, personParcelBuffer] = useParcelForm({
        value: initialValue,
        onChange: (parcel) => saveMyData(parcel.value),
        // ^ returns a promise
        onChangeUseResult: true,
        rekey: () => rekey()
    });

    let personParcelState = personParcelBuffer._outerParcel;
    return exampleFrame({personParcelState, personParcel}, <div>
        <label>firstname</label>
        <ParcelBoundary parcel={personParcel.get('firstname')}>
            {(firstname) => <div>
                <input type="checkbox" style={{width: '2rem'}} {...firstname.metaAsParcel('selected').spreadDOMCheckbox()} />
                <input type="text" {...firstname.spreadDOM()} />
            </div>}
        </ParcelBoundary>

        <label>lastname</label>
        <ParcelBoundary parcel={personParcel.get('lastname')}>
            {(lastname) => <div>
                <input type="checkbox" style={{width: '2rem'}} {...lastname.metaAsParcel('selected').spreadDOMCheckbox()} />
                <input type="text" {...lastname.spreadDOM()} />
            </div>}
        </ParcelBoundary>

        <button onClick={() => personParcelBuffer.submit()}>Submit</button>

        <p>Request state: <strong>{requestState}</strong>
            {requestState === "pending..." && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}
