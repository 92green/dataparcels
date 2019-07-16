import React from 'react';
import {useRef} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

const initialValue = {
    firstname: "",
    lastname: "",
    timeUpdated: undefined
};

export default function PersonEditor(props) {

    let rejectRef = useRef(() => {});

    let saveMyData = ({firstname, lastname}) => new Promise((resolve, reject) => {

        let timeout = setTimeout(() => {
            resolve({
                firstname: firstname.toLowerCase(),
                lastname: lastname.toLowerCase(),
                timeUpdated: new Date()
            });
        }, 2000);

        rejectRef.current = () => {
            clearTimeout(timeout);
            reject('rejected');
        };
    });

    let [personParcel, personParcelControl] = useParcelForm({
        value: initialValue,
        onSubmit: (parcel) => saveMyData(parcel.value),
        onSubmitUseResult: true
    });

    let {timeUpdated} = personParcel.value;

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

        <p>Time updated: {timeUpdated && timeUpdated.toLocaleString()}</p>

        <button onClick={() => personParcelControl.submit()}>Submit</button>

        <p>Request state: <strong>{personParcelControl.submitStatus.status}</strong>
            {personParcelControl.submitStatus.isPending && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}
