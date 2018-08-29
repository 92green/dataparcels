import React from 'react';
import FlipMove from 'react-flip-move';
import {ParcelHoc, PureParcel} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const FruitListParcelHoc = ParcelHoc({
    name: "fruitListParcel",
    initialValue: (/* props */) => [
        "Apple",
        "Banana",
        "Crumpets"
    ]
});

const FruitListEditor = (props) => {
    let {fruitListParcel} = props;
    return <FlipMove>
        {fruitListParcel.toArray((fruitParcel) => {
            return <PureParcel parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrevWithSelf()}>^</button>
                    <button onClick={() => parcel.swapNextWithSelf()}>v</button>
                    <button onClick={() => parcel.insertAfterSelf(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.deleteSelf()}>x</button>
                </div>}
            </PureParcel>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </FlipMove>;
};

export default FruitListParcelHoc(ExampleHoc(FruitListEditor));
