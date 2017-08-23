import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';

export default class ExampleObjectWithMeta extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                address: "12 Hammy Grove",
                email: "pumpersnipe@eudoramail.com"
            },
            meta: {
                valid: {
                    address: true,
                    email: false
                }
            }
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

        return <Example title="Object with Meta" state={this.state}>
            <div className="marginBottom2">
                <label className="Label">address</label>
                <input className="Input" type="text" {...parcel.get('address').spreadDOM()} />
                <div>Valid? {parcel.get('address').meta('valid') ? 'true' : 'false'}</div>
                <button className="Button Button-inline" onClick={() => parcel.get('address').metaChange('valid')(true)}>Set to true</button>
                <button className="Button Button-inline" onClick={() => parcel.get('address').metaChange('valid')(false)}>Set to false</button>
            </div>
            <div className="marginBottom2">
                <label className="Label">email</label>
                <input className="Input" type="text" {...parcel.get('email').spreadDOM()} />
                <div>Valid? {parcel.get('email').meta('valid') ? 'true' : 'false'}</div>
                <button className="Button Button-inline" onClick={() => parcel.get('email').metaChange('valid')(true)}>Set to true</button>
                <button className="Button Button-inline" onClick={() => parcel.get('email').metaChange('valid')(false)}>Set to false</button>
            </div>
        </Example>;
    }
}
