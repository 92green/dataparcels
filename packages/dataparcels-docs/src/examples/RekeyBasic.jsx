import React from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import dangerouslyUpdateParcelData from 'react-dataparcels/dangerouslyUpdateParcelData';
import rekey from 'react-dataparcels/rekey';
import exampleFrame from 'component/exampleFrame';

export default function PersonEditor(props) {

    let [requestState, setRequestState] = useState("idle");
    let rejectRef = useRef(() => {});

    let saveMyData = (data) => new Promise((resolve, reject) => {
        setRequestState("pending...");

        let timeout = setTimeout(() => {
            setRequestState("resolved");
            resolve({
                ...data,
                timeUpdated: new Date()
            });
        }, 2000);

        rejectRef.current = () => {
            setRequestState("rejected");
            clearTimeout(timeout);
            reject();
        };
    });

    let [personParcel, personParcelBuffer] = useParcelForm({
        value: () => ({
            animals: [
                {id: "A", type: "dog"},
                {id: "B", type: "cat"}
            ],
            timeUpdated: undefined
        }),
        onChange: (parcel) => saveMyData(parcel.value),
        onChangeUseResult: true,
        rekey: () => rekey()
        //beforeChange: [dangerouslyUpdateParcelData((d => console.log("beforeChange", d) || d))]
    });

    let {timeUpdated} = personParcel.value;

    let personParcelState = personParcelBuffer._outerParcel;
    return exampleFrame({personParcelState, personParcel}, <div>
        <label>animals</label>
        {personParcel.get('animals').toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <label>id: "{fruitParcel.get('id').value}"</label>
                    <input type="text" {...parcel.get('type').spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.get('type').value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                    <span className="Text Text-monospace">key {fruitParcel.key}</span>
                </div>}
            </ParcelBoundary>;
        })}

        <p>Time updated: {timeUpdated && timeUpdated.toLocaleString()}</p>

        <button onClick={() => personParcelBuffer.submit()}>Submit</button>

        <p>Request state: <strong>{requestState}</strong>
            {requestState === "pending..." && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}
