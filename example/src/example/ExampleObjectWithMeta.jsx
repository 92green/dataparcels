import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, Paragraph} from 'obtuse';

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
                correct: {
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

        const description = <Box>
            <Paragraph>It's common to need to store metadata related to values, such as whether a value is valid, whether a user has changed the value (a.k.a. "dirty") etc. Meta items are keyed and should be the same shape as your <Code>value</Code> data structure.</Paragraph>
            <Paragraph>Pass in a <Code>meta</Code> object in your <Code>parcelData</Code> to set the meta.</Paragraph>
            <Paragraph>Use <Code>.meta(key)</Code> to retrieve your meta.</Paragraph>
            <Paragraph>Change your meta by calling <Code>.meta(key)(newMetaValue)</Code>. Like <Code>.onChange()</Code>, it wont change the value directly, but will call the parcel's <Code>handleChange</Code> function with the new meta in it.</Paragraph>
        </Box>;

        return <Example
            title="Object with Meta"
            description={description}
            state={this.state}
            source={this.props.source}
        >
            <div className="marginBottom2">
                <label className="Label">address</label>
                <input className="Input" type="text" {...parcel.get('address').spreadDOM()} />
                <span className="Text Text--Button">Is this correct? {parcel.get('address').meta('correct') ? 'true' : 'false'}</span>
                <button className="Button Button-inline" onClick={() => parcel.get('address').metaChange('correct')(true)}>Set to true</button>
                <button className="Button Button-inline" onClick={() => parcel.get('address').metaChange('correct')(false)}>Set to false</button>
            </div>
            <div className="marginBottom2">
                <label className="Label">email</label>
                <input className="Input" type="text" {...parcel.get('email').spreadDOM()} />
                <span className="Text Text--Button">Is this correct? {parcel.get('email').meta('correct') ? 'true' : 'false'}</span>
                <button className="Button Button-inline" onClick={() => parcel.get('email').metaChange('correct')(true)}>Set to true</button>
                <button className="Button Button-inline" onClick={() => parcel.get('email').metaChange('correct')(false)}>Set to false</button>
            </div>
        </Example>;
    }
}
