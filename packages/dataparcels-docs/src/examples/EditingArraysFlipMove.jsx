import React from 'react';
import FlipMove from 'react-flip-move';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

export default function FruitListEditor(props) {

    let [fruitListParcel] = useParcelState({
        value: [
            "Apple",
            "Banana",
            "Crumpets"
        ]
    });

    return exampleFrame({fruitListParcel}, <FlipMove>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </FlipMove>);
}
