import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const DelayParcelHoc = ParcelHoc({
    name: "delayParcel",
    valueFromProps: (props) => `Created at ${props.seconds} seconds!`,
    delayUntil: (props) => props.seconds > 3
});

const DelayEditor = (props) => {
    let {delayParcel, seconds} = props;

    let input = delayParcel
        ? <input type="text" {...delayParcel.spreadDOM()} />
        : <p>No parcel yet...</p>;

    return <div>
        <p>Seconds: {seconds}</p>
        {input}
    </div>;
};

const DelayExample = DelayParcelHoc(ExampleHoc(DelayEditor));

export default class ParcelHocDelayUntilExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0
        };
        this.interval = setInterval(() => {
            this.setState(({seconds}) => ({
                seconds: seconds + 1
            }));
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let {seconds} = this.state;
        return <DelayExample seconds={seconds} />;
    }
}
