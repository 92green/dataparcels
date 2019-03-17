import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;

    let selectedFruit = fruitListParcel
        .toArray()
        .filter(fruitParcel => fruitParcel.meta.selected)
        .map(fruitParcel => fruitParcel.value);

    return <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => {
                    let checkboxProps = {
                        checked: !!parcel.meta.selected,
                        onChange: (event) => parcel.setMeta({
                            selected: event.currentTarget.checked
                        })
                    };

                    return <div>
                        <input type="text" {...parcel.spreadDOM()} />
                        <input type="checkbox" style={{width: '2rem'}} {...checkboxProps} />
                        <button onClick={() => parcel.swapPrev()}>^</button>
                        <button onClick={() => parcel.swapNext()}>v</button>
                        <button onClick={() => parcel.delete()}>x</button>
                    </div>;
                }}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
        <h4>Selected fruit:</h4>
        <ul>
            {selectedFruit.map((fruit, key) => <li key={key}>{fruit}</li>)}
        </ul>
    </div>;
};

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));
