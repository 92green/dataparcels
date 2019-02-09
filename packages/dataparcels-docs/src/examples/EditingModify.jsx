import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import shape from 'react-dataparcels/shape';
import CancelActionMarker from 'react-dataparcels/CancelActionMarker';
import ExampleHoc from 'component/ExampleHoc';

const ExampleParcelHoc = ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (/* props */) => ({
        alphanumeric: "Abc123",
        number: 123,
        delimitedString: "abc.def",
        missingValue: undefined,
        edges: [
            {node: "A"},
            {node: "B"}
        ]
    })
});

const AlphanumericInput = (props) => {
    let alphanumericParcel = props
        .alphanumericParcel
        .modifyUp(string => string.replace(/[^a-zA-Z0-9]/g, ""));
        // ^ remove non alpha numeric characters on the way up

    return <ParcelBoundary parcel={alphanumericParcel}>
        {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
    </ParcelBoundary>;
};

const NumberInput = (props) => {
    let numberParcel = props
        .numberParcel
        .modifyDown(number => `${number}`)
        // ^ turn value into a string on the way down
        .modifyUp(string => {
            let number = Number(string);
            return isNaN(number) ? CancelActionMarker : number;
        });
        // ^ turn value back into a number on the way up
        //   but cancel the change if the string
        //   could not be turned into a number

    // without the keepState prop, typing "0.10"
    // would immediately be replaced with "0.1"
    // as the new value is turned into a number on the way up,
    // and into a string on the way down
    // which would make typing very frustrating

    return <ParcelBoundary parcel={numberParcel} keepState>
        {(parcel) => <div>
            <input type="text" {...parcel.spreadDOM()} />
            {isNaN(Number(parcel.value)) && "Invalid number"}
        </div>}
    </ParcelBoundary>;
};

const DelimitedStringInput = (props) => {
    let delimitedStringParcel = props
        .delimitedStringParcel
        .modifyDown(string => string.split("."))
        //  ^ turn value into an array on the way down
        .modifyUp(array => array.join("."));
        // ^ turn value back into a string on the way up

    return <div>
        {delimitedStringParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <div>
                    <input type="text" {...parcel.spreadDOM()} />
                    <button onClick={() => parcel.swapPrev()}>^</button>
                    <button onClick={() => parcel.swapNext()}>v</button>
                    <button onClick={() => parcel.delete()}>x</button>
                </div>}
            </ParcelBoundary>;
        })}
        <button onClick={() => delimitedStringParcel.push("")}>Add new path segment</button>
    </div>;
};

const MissingValueInput = (props) => {
    let missingValueParcel = props
        .missingValueParcel
        .modifyDown(value => value || [])
        // ^ turn value into an array if its missing
        //   so we can always render against an array

    return <div>
        {missingValueParcel.toArray((segmentParcel) => {
            return <ParcelBoundary parcel={segmentParcel} key={segmentParcel.key}>
                {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
            </ParcelBoundary>;
        })}
        <button onClick={() => missingValueParcel.push("")}>Add new element</button>
    </div>;
};

// const EdgesNodesInput = (props) => {
//     let arrayParcel = props
//         .edgesParcel
//         .modifyDown(shape((edges) => {
//             return edges
//                 .toArray()
//                 .map(node => node.get('node'));
//         }))
//         .modifyUp(shape((items) => {
//             return items
//                 .toArray()
//                 .map(node => new ParcelShape({}).set('node', node));
//         }));

//     console.log(props.edgesParcel.value);
//     console.log(arrayParcel.value);

//     return <div>
//         {arrayParcel.toArray((item) => {
//             return <ParcelBoundary parcel={item} key={item.key}>
//                 {(parcel) => <input type="text" {...parcel.spreadDOM()} />}
//             </ParcelBoundary>;
//         })}
//         <button onClick={() => arrayParcel.push("")}>Add new element</button>
//     </div>;
// };

const ExampleEditor = (props) => {
    let {exampleParcel} = props;
    return <div>
        <h4>Alphanumeric input</h4>
        <p>Disallows all non-alphanumeric characters.</p>
        <AlphanumericInput alphanumericParcel={exampleParcel.get('alphanumeric')} />

        <h4>Number > string</h4>
        <p>Turns a stored number into a string for editing, and only allows changes that are valid numbers.</p>
        <NumberInput numberParcel={exampleParcel.get('number')} />

        <h4>Delimited string > array of strings</h4>
        <p>Turns a stored string into an array so array editing controls can be rendered.</p>
        <DelimitedStringInput delimitedStringParcel={exampleParcel.get('delimitedString')} />

        <h4>Compensating for missing values</h4>
        <p>Prepares values so that editors can remain simple.</p>
        <MissingValueInput missingValueParcel={exampleParcel.get('missingValue')} />

        {/*<h4>Modifying the data shape with a shape updater</h4>
        <EdgesNodesInput edgesParcel={exampleParcel.get('edges')} />*/}
    </div>;
};

export default ExampleParcelHoc(ExampleHoc(ExampleEditor));
