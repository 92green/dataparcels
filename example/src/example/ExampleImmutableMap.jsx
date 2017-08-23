import React from 'react';
import Parcel from 'parcels';
import {Map} from 'immutable';
import Example from '../component/Example';

export default class ExampleImmutableMap extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: Map({
                firstname: "Breep",
                lastname: "Clamperton"
            })
        };
    }

    handleChange(payload) {
        this.setState(payload);
    }

    render() {
        var parcel = Parcel(
            this.state,
            this.handleChange
        );

        return <Example title="Immutable Map" state={this.state}>
            <div>
                <label className="Label">firstname</label>
                <input className="Input" type="text" {...parcel.get('firstname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <input className="Input" type="text" {...parcel.get('lastname').spreadDOM()} />
            </div>
        </Example>;
    }
}
