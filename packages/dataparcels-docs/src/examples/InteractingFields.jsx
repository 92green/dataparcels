import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';

const calculate = (value, changeRequest) => {
    let {a, b, sum} = value;

    if(changeRequest.originPath[0] !== "sum") {
        // if the change didn't come from sum, calculate sum based on a and b
        sum = a + b;
    } else {
        // if the change came from sum, scale a and b based on the change in sum
        let prevSum = changeRequest.prevData.value.sum;

        if(prevSum !== 0) {
            // if prevSum isn't zero, scale a and b to fit sum
            let scale = sum / prevSum;
            a *= scale;
            b *= scale;
        } else {
            // or else just set a and b to half of sum
            a = sum / 2;
            b = sum / 2;
        }
    }

    return {a, b, sum};
};

const SumParcelHoc = ParcelHoc({
    name: "sumParcel",
    valueFromProps: (/* props */) => ({
        a: 5,
        b: 5,
        sum: undefined
    }),
    modifyBeforeUpdate: [
        calculate
    ]
});

// use the function from the "Modifying data to fit the UI" example
// to turn numbers into strings on the way down
// and back into numbers on the way up
const numberToString = (parcel) => parcel
    .modifyDown(number => `${number}`)
    .modifyUp(string => {
        let number = Number(string);
        return isNaN(number) ? CancelActionMarker : number;
    });

const AreaEditor = (props) => {
    let {sumParcel} = props;
    return <div>
        <label>a</label>
        <ParcelBoundary parcel={sumParcel.get('a').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>

        <label>b</label>
        <ParcelBoundary parcel={sumParcel.get('b').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>

        <label>sum</label>
        <ParcelBoundary parcel={sumParcel.get('sum').pipe(numberToString)} keepValue>
            {(parcel) => <input type="number" step="any" {...parcel.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default SumParcelHoc(ExampleHoc(AreaEditor));
