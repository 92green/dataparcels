import React from 'react';
import Parcel from 'parcels';
import {Map} from 'immutable';
import Example from '../component/Example';
import {Box, Code, Paragraph} from 'obtuse';

export default class ExampleImmutableMap extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: Map({
                firstname: "Bobbert",
                lastname: "Helmsfire"
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

        const description = <Box>
            <Paragraph>Parcels work with Immutable.js <Code>Map</Code>s and <Code>List</Code>s, as well as normal objects and arrays.</Paragraph>
        </Box>;

        return <Example
            title="Immutable Map"
            description={description}
            state={this.state}
            source={this.props.source}
        >
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
