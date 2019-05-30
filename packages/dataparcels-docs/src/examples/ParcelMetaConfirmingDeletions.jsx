import React from 'react';
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

    return exampleFrame({fruitListParcel}, <div>
        {fruitListParcel.toArray((fruitParcel) => {
            return <ParcelBoundary parcel={fruitParcel} key={fruitParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    {parcel.meta.confirming
                        ? <span><span className="Text Text-marginRight">Are you sure?</span>
                            <button onClick={() => parcel.delete()}>yes</button>
                            <button onClick={() => parcel.setMeta({confirming: false})}>no</button>
                        </span>
                        : <button onClick={() => parcel.setMeta({confirming: true})}>x</button>}
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => fruitListParcel.push("New fruit")}>Add new fruit</button>
    </div>);
}
