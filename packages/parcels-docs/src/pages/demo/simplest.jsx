import React from 'react';
import Parcel from 'parcels';
/*nosrc*/
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';
import Example from '../../components/Navigation2';
/*endnosrc*/

export default class ExampleSimpleObject extends React.Component {
    constructor(props) {
        super(props);

        let parcel = new Parcel({
            value: "A value",
            handleChange: (parcel) => this.setState({parcel})
        });

        this.state = {parcel};
    }

    render() {
        let {parcel} = this.state;
        /*nosrc*/
        const description = <Box>
            <Paragraph>To make a parcel, call <Code>new Parcel()</Code> and pass an object with the following contents:</Paragraph>
            <Box modifier="padding">
                <List element="ol" modifier="ordered">
                    <ListItem modifier="marginKilo">
                        <Text element="p">
                            <Text modifier="strong">value:</Text> <Text modifier="primary">*</Text>
                        </Text>
                        <Text element="p">The value you want to manipulate.</Text>
                    </ListItem>
                    <ListItem modifier="marginKilo">
                        <Text element="p">
                            <Text modifier="strong">handleChange:</Text> <Text modifier="primary">Function (newParcelData: *, action: Action) => {"{}"}</Text>
                        </Text>
                        <Text element="p">A function that will be called when the parcel's value changes. The function will be passed a new parcel containing the updated value.</Text>
                        <Text element="p">Do what you will with this function. When using React you'll likely want to store the new parcel in state somewhere.</Text>
                    </ListItem>
                </List>
            </Box>
            <Paragraph>Your new parcel contains your value, which you can retrieve by calling <Code>.value()</Code>.</Paragraph>
            <Paragraph>You can request to change the value by calling <Code>.onChange(newValue)</Code>. This wont change the value directly but will call the parcel's <Code>handleChange</Code> function, which creates a new parcel containing your updated value. This becomes very useful with nested data structures, because parcels will call their parent's <Code>handleChange</Code> functions.</Paragraph>
            <Paragraph><Code>.spreadDOM()</Code> is used to conveniently create <Code>value</Code> and <Code>onChange</Code> props to spread onto your inputs.</Paragraph>
        </Box>;
        /*endnosrc*/

        return /*nosrc*/<Example
            title="The Simplest Parcel"
            description={description}
            state={this.state}
            source={this.props.source}
        >{/*endnosrc*/}<div>
            <label className="Label">value</label>
            <input className="Input" type="text" {...parcel.spreadDOM()} />
        </div>{/*nosrc*/}</Example>/*endnosrc*/;
    }
}
