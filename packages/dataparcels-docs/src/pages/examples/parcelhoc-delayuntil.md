import Link from 'gatsby-link';
import ParcelHocExampleDelayUntil from 'examples/ParcelHocExampleDelayUntil';

This example shows how to delay the creation of a Parcel with `ParcelHoc`. The example counts the number of seconds that have passed, and passes this into the `DelayExample` component. The `ParcelHoc` is set to delay until seconds > 3. Once seconds = 4, `valueFromProps` is called and the Parcel is created.

<Link to="/api/ParcelHoc#delayUntil">API reference for ParcelHoc.delayUntil</Link>

<ParcelHocExampleDelayUntil />

```js
import React from 'react';
import {ParcelHoc} from 'react-dataparcels';

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

const DelayExample = DelayParcelHoc(DelayEditor);

export default class ParcelHocDelayUntilExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0
        };
        setInterval(() => {
            this.setState(({seconds}) => ({
                seconds: seconds + 1
            }));
        }, 1000);
    }

    render() {
        let {seconds} = this.state;
        return <DelayExample seconds={seconds} />;
    }
}


```
