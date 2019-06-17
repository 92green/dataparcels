import React from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {useState} from 'react';
import useParcelForm from 'react-dataparcels/useParcelForm';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import rekey from 'react-dataparcels/rekey';
import exampleFrame from 'component/exampleFrame';
import dogNames from 'dog-names';

function Foo(props) {

    let [requestState, setRequestState] = useState("idle");
    let rejectRef = useRef(() => {});

    let saveMyData = (value) => new Promise((resolve, reject) => {
        setRequestState("pending...");

        let timeout = setTimeout(() => {
            setRequestState("resolved");
            resolve(value);
        }, 1000);

        rejectRef.current = () => {
            setRequestState("rejected");
            clearTimeout(timeout);
            reject();
        };
    });

    let [personParcel, petNamesParcelBuffer] = useParcelForm({
        value: props.petNames,
        updateValue: true,
        onChange: (parcel) => saveMyData(parcel.value),
        // ^ returns a promise
        rekey: () => rekey()
    });

    let petNamesParcelState = petNamesParcelBuffer._outerParcel;
    return exampleFrame({petNamesParcelState, personParcel}, <div>
        <label>cat</label>
        <ParcelBoundary parcel={personParcel.get('cat')}>
            {(cat) => <div>
                <input type="checkbox" style={{width: '2rem'}} {...cat.metaAsParcel('selected').spreadDOMCheckbox()} />
                <input type="text" {...cat.spreadDOM()} />
            </div>}
        </ParcelBoundary>

        <label>dog</label>
        <ParcelBoundary parcel={personParcel.get('dog')}>
            {(dog) => <div>
                <input type="checkbox" style={{width: '2rem'}} {...dog.metaAsParcel('selected').spreadDOMCheckbox()} />
                <input type="text" {...dog.spreadDOM()} />
            </div>}
        </ParcelBoundary>

        <label>fish</label>
        <ParcelBoundary parcel={personParcel.get('fish')}>
            {(fish) => <div>
                <input type="checkbox" style={{width: '2rem'}} {...fish.metaAsParcel('selected').spreadDOMCheckbox()} />
                <input type="text" {...fish.spreadDOM()} />
            </div>}
        </ParcelBoundary>

        <button onClick={() => petNamesParcelBuffer.submit()}>Submit</button>

        <p>Request state: <strong>{requestState}</strong>
            {requestState === "pending..." && <button onClick={rejectRef.current}>reject</button>}
        </p>
    </div>);
}

export default function FooData() {

    let [petNames, setPetNames] = useState(() => ({
        dog: "Fido",
        cat: "Snowball",
        fish: "Swimmy"
    }));

    useEffect(() => {
        let timer;
        let step = () => {
            setPetNames(petNames => {
                let newPetNames = {...petNames};
                let key = ['dog','cat','fish'][Math.floor(Math.random() * 3)];
                newPetNames[key] = dogNames.allRandom();
                return newPetNames;
            });
            timer = setTimeout(step, 2000 + Math.random() * 2000);
        };
        step();

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return <Foo petNames={petNames} />;
}
