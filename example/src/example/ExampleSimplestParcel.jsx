import React from 'react';
import Parcel from 'parcels';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';
import Example from '../component/Example';

export default class ExampleSimpleObject extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: "A value"
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
            <Paragraph>To make a parcel, call <Code>new Parcel()</Code> and pass it two arguments:</Paragraph>
            <Box modifier="padding">
                <List element="ol" modifier="ordered">
                    <ListItem modifier="marginKilo">
                        <Text element="p">
                            <Text modifier="strong">parcelData:</Text> <Text modifier="primary">Object {"{"}value: *, ?meta: Object{"}"}</Text>
                        </Text>
                        <Text element="p">An object containing the parcel's <Code>value</Code> as a property.</Text>
                        <Text element="p">It may also have a <Code>meta</Code> property, we'll get to that in a minute.</Text>
                    </ListItem>
                    <ListItem modifier="marginKilo">
                        <Text element="p">
                            <Text modifier="strong">handleChange:</Text> <Text modifier="primary">Function (newParcelData) => {"{}"}</Text>
                        </Text>
                        <Text element="p">A function that will be called when the parcel's value changes. The function will be passed the updated parcel data.</Text>
                        <Text element="p">Do what you will with this function. Often you'll want to use it to store the data in state somewhere.</Text>
                    </ListItem>
                </List>
            </Box>
            <Paragraph>Your new parcel contains your value, which you can retrieve by calling <Code>.value()</Code>.</Paragraph>
            <Paragraph>You can request to change the value by calling <Code>.onChange(newValue)</Code>. This wont change the value directly, but will call the parcel's <Code>handleChange</Code> function with your updated value. This becomes very useful with nested data structures, because parcels will call their parent's <Code>handleChange</Code> functions.</Paragraph>
            <Paragraph><Code>.spreadDOM()</Code> is used to conveniently create <Code>value</Code> and <Code>onChange</Code> props to spread onto your inputs.</Paragraph>
        </Box>;

        return <Example
            title="The Simplest Parcel"
            description={description}
            state={this.state}
        >
            <div>
                <label className="Label">value</label>
                <input className="Input" type="text" {...parcel.spreadDOM()} />
            </div>
        </Example>;
    }
}
