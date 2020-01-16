import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ParcelDrag from 'react-dataparcels-drag';
import exampleFrame from 'component/exampleFrame';

export default function FruitListEditor(props) {

    let [fruitListParcel] = useParcelState({
        value: [
            "Apple",
            "Banana",
            "Crumpets"
        ]
    });

    return exampleFrame({fruitListParcel}, <div>
        <ParcelDrag parcel={fruitListParcel}>
            {(fruitParcel) => <ParcelBoundary parcel={fruitParcel}>
                {(parcel) => <div className="Box-draggable Typography">
                    <input type="text" {...parcel.spreadInput()} />
                    <button onClick={() => parcel.insertAfter(`${parcel.value} copy`)}>+</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>}
        </ParcelDrag>
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>);
}
