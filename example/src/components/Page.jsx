import React from 'react';
import {Box, Terminal, Text} from 'obtuse';
import {Input, Label} from 'stampy';
import {Parcel} from 'parcel';

export default function Page() {
    return <Box>
        <Text modifier="alpha">Parcel</Text>
        <Example />
    </Box>;
}

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                firstname: "Breep",
                lastname: "Clamperton",
                address: {
                    streetAddress: "10 Spaldercombs Ave",
                    postcode: "3456"
                },
                pets: [
                    {
                        name: "Krygon Spilfs",
                        occupation: "Executive Stategist"
                    },
                    {
                        name: "Fluffy",
                        occupation: "Mortician"
                    }
                ]
            }
        };
    }

    handleChange(payload) {
        this.setState({
            value: payload
        });
    }

    render() {
        var parcel = new Parcel(
            this.state.value,
            this.handleChange
        );

        console.log(parcel.getIn(['address', 'address']));

        return <Box>
            <Box>
                <Text modifier="beta">Inputs</Text>

                <Text element="p">
                    <Label className="marginRight">firstname</Label>
                    <Input modifier="text" {...parcel.get('firstname').spread()} />
                </Text>

                <Text element="p">
                    <Label className="marginRight">lastname</Label>
                    <Input modifier="text" {...parcel.get('lastname').spread()} />
                </Text>

                <Text element="p">
                    <Label className="marginRight">address.streetAddress</Label>
                    <Input modifier="text" {...parcel.getIn(['address', 'streetAddress']).spread()} />
                </Text>

                <Text element="p">
                    <Label className="marginRight">address.postcode</Label>
                    <Input modifier="text" {...parcel.getIn(['address', 'postcode']).spread()} />
                </Text>
            </Box>
            <Box>
                <Text modifier="beta">State</Text>
                <Terminal>
                    <pre>{JSON.stringify(this.state, null, 4)}</pre>
                </Terminal>
            </Box>
        </Box>;
    }
}
