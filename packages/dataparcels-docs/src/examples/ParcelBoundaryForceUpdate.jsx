import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const ColourParcelHoc = ParcelHoc({
    name: "colourParcel",
    valueFromProps: (/* props */) => "Option A"
});

const ColourEditor = (props) => {
    let {colourParcel, options} = props;
    return <div>
        <label>favourite colour</label>
        <ParcelBoundary parcel={colourParcel} forceUpdate={[options]}>
            {(mains) => <select {...mains.spreadDOM()}>
                {options.map(({label, value}) => <option key={value} value={value}>{label}</option>)}
            </select>}
        </ParcelBoundary>
    </div>;
};

const FoceUpdateExample = ColourParcelHoc(ExampleHoc(ColourEditor));

export default class ParcelHocDelayUntilExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        };
        setTimeout(() => {
            this.setState({
                options: [
                    {label: "Option A", value: "Option A"},
                    {label: "Option B", value: "Option B"}
                ]
            });
        }, 1000);
    }

    render() {
        let {options} = this.state;
        return <FoceUpdateExample options={options} />;
    }
}
