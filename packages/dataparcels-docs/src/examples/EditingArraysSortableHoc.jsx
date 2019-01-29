import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import ExampleHoc from 'component/ExampleHoc';

// this is a generic react-sortable-hoc + dataparcels list hoc
// that you can use in your own projects

const SortableParcelList = ({element, container}) => {
    let Container = container || 'div';
    let Element = SortableElement(({parcel, ...rest}) => element(parcel, rest));

    return SortableContainer(({parcel}) => <Container>
        {parcel.toArray((elementParcel, index) => <Element
            key={elementParcel.key}
            index={index}
            parcel={elementParcel}
        />)}
    </Container>);
};

// use the generic react-sortable-hoc + dataparcels list hoc
// to create a fruit-specific sortable list component

const SortableFruitList = SortableParcelList({
    element: (parcel) => <ParcelBoundary parcel={parcel}>
        {(parcel) => <div className="Box-draggable Typography">
            <input type="text" {...parcel.spreadDOM()} />
            <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
            <button onClick={() => parcel.delete()}>x</button>
        </div>}
    </ParcelBoundary>
});

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
    return <div>
        <SortableFruitList
            parcel={fruitListParcel}
            onSortEnd={({oldIndex, newIndex}) => fruitListParcel.move(oldIndex, newIndex)}
        />
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>;
};

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));
