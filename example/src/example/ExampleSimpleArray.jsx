import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';

export default class ExampleSimpleArray extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: ["A", "B", "C"]
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
            <Paragraph>You can map over a value's keys using <Code>.map()</Code>, passing it a mapper function that will be called for each key. The mapper function receives the following arguments.</Paragraph>
            <Box modifier="padding">
                <List element="ol" modifier="ordered">
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">itemParcel:</Text> <Text modifier="primary">Parcel</Text>
                        </Text>
                        <Text element="p">A parcel containing the value of each item.</Text>
                    </ListItem>
                    <ListItem className="marginBottom">
                        <Text element="p">
                            <Text modifier="strong">key:</Text> <Text modifier="primary">number|string</Text>
                        </Text>
                        <Text element="p">The key of the current item.</Text>
                    </ListItem>
                </List>
            </Box>
        </Box>;

        return <Example
            title="Simple Array"
            state={this.state}
            description={description}
        >
            {parcel.map((itemParcel, key) => {
                return <div key={key}>
                    <label className="Label">item {key}</label>
                    <input className="Input" type="text" {...itemParcel.spreadDOM()} />
                </div>;
            }).value()}
        </Example>;
    }
}
