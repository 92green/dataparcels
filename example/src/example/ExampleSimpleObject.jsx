import React from 'react';
import Parcel from 'parcels';
import {Box, Code, Paragraph} from 'obtuse';
import Example from '../component/Example';

export default class ExampleSimpleObject extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                firstname: "Breep",
                lastname: "Clamperton"
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
            <Paragraph>Creates a parcel and allows you to change property values on the parcel. It uses the <Code>.get()</Code> method to create parcels for <Code>firstname</Code> and <Code>lastname</Code> before spreading the <Code>value</Code> and <Code>onChange</Code> onto the inputs.</Paragraph>
        </Box>;

        return <Example
            title="Simple Object"
            description={description}
            state={this.state}
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
