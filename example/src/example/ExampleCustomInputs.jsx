import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, Paragraph} from 'obtuse';

function Input(props) {
    return <input
        type="text"
        className="Input"
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
    />;
}

export default class ExampleCustomInputs extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                firstname: "Helix",
                lastname: "Robertson"
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
            <Paragraph>If you have your own <Code>Input</Code> components, it's nice to pass the new value as the first argument to <Code>onChange</Code> instead of passing the HTML event. If you're using this pattern, use <Code>.spread()</Code> instead of <Code>.spreadDOM()</Code>.</Paragraph>
        </Box>;

        return <Example
            title="Custom Inputs"
            description={description}
            state={this.state}
        >
            <div>
                <label className="Label">firstname</label>
                <Input {...parcel.get('firstname').spread()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <Input {...parcel.get('lastname').spread()} />
            </div>
        </Example>;
    }
}
