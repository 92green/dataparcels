import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelBoundaryHoc from 'react-dataparcels/ParcelBoundaryHoc';
import Validation from 'react-dataparcels/Validation';
import ExampleHoc from 'component/ExampleHoc';
import composeWith from 'unmutable/composeWith';

const numberToString = (parcel) => parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => Number(string));

const InputWithError = (parcel) => <div>
    <input type="text" {...parcel.spreadDOM()} />
    {parcel.meta.invalid && <div className="Text Text-sizeMilli Box-paddingBottom">Error: {parcel.meta.invalid}</div>}
</div>;

const AnimalEditor = (props) => {
    let {animalParcel, animalParcelControl} = props;
    let {valid} = animalParcel.meta;

    return <div>
        <label>name</label>
        <ParcelBoundary parcel={animalParcel.get('name')}>
            {InputWithError}
        </ParcelBoundary>

        <div className="Box Box-paddingLeft">
            {animalParcel.get('animals').toArray((animalParcel) => {
                return <ParcelBoundary parcel={animalParcel} key={animalParcel.key}>
                    {(animalParcel) => <div>
                        <label>type</label>
                        <ParcelBoundary parcel={animalParcel.get('type')}>
                            {InputWithError}
                        </ParcelBoundary>

                        <label>amount</label>
                        <ParcelBoundary parcel={animalParcel.get('amount').pipe(numberToString)} keepValue>
                            {InputWithError}
                        </ParcelBoundary>

                        <button onClick={() => animalParcel.swapPrev()}>^</button>
                        <button onClick={() => animalParcel.swapNext()}>v</button>
                        <button onClick={() => animalParcel.delete()}>x</button>
                    </div>}
                </ParcelBoundary>;
            })}
            <button onClick={() => animalParcel.get('animals').push({type: "?", amount: 0})}>Add new animal</button>
        </div>

        <button onClick={() => valid && animalParcelControl.release()}>{valid ? "Submit" : "Can't submit"}</button>
        <button onClick={() => animalParcelControl.cancel()}>Cancel</button>
    </div>;
};

const validateStringNotBlank = (name) => (value) => {
    return (!value || value.trim().length === 0) && `${name} must not be blank`;
};

const validateInteger = (name) => (value) => {
    return !Number.isInteger(value) && `${name} must be a whole number`;
};

const validatePositiveNumber = (name) => (value) => {
    return value < 0 && `${name} must not be negative`;
};

const validation = Validation({
    'name': validateStringNotBlank("Name"),
    'animals.*.type': validateStringNotBlank("Animal type"),
    'animals.*.amount': [
        validateInteger("Animal amount"),
        validatePositiveNumber("Animal amount")
    ]
});

// unmutable's composeWith(a,b,c) is equivalent to a(b(c))

export default composeWith(
    ParcelHoc({
        name: "animalParcel",
        valueFromProps: (/* props */) => ({
            name: "Robert Clamps",
            animals: [
                {type: "Sheep", amount: 6}
            ]
        })
    }),
    ExampleHoc,
    ParcelBoundaryHoc({
        name: "animalParcel",
        hold: true,
        modifyBeforeUpdate: [validation.modifyBeforeUpdate]
    }),
    AnimalEditor
);
