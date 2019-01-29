import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    valueFromProps: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const SortableFruitItem = SortableElement(({fruitParcel}) => {
    return <ParcelBoundary parcel={fruitParcel}>
        {(parcel) => <div className="Box-draggable Typography">
            <input type="text" {...parcel.spreadDOM()} />
            <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
            <button onClick={() => parcel.delete()}>x</button>
        </div>}
    </ParcelBoundary>;
});

const SortableFruitList = SortableContainer(({fruitListParcel}) => {
    return <div>
        {fruitListParcel.toArray((fruitParcel, index) => {
            return <SortableFruitItem
                key={fruitParcel.key}
                index={index}
                fruitParcel={fruitParcel}
            />;
        })}
    </div>;
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <div>
        <SortableFruitList
            fruitListParcel={fruitListParcel}
            onSortEnd={({oldIndex, newIndex}) => fruitListParcel.move(oldIndex, newIndex)}
        />
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));
