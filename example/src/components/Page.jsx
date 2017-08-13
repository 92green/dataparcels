import React from 'react';
import {Box, Terminal, Text} from 'obtuse';
import {Input, Label, Button} from 'stampy';
import Parcel from 'parcels';

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
        var parcel = Parcel(
            this.state.value,
            this.handleChange
        );

        var pets = parcel.get('pets');
        console.log(pets);

        var newPet = {
            name: "New pet",
            occupation: ""
        };

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
                    <Input modifier="text" {...parcel.getIn(['address', 'postcode']).modify(ii => `${ii}`, ii => ii.replace(/[^0-9]/g, '')).spread()} />
                </Text>

                {pets.map((pp, key) => {
                    console.log(`pets[${key}]`, pp);

                    const name = pp.get('name');
                    const occupation = pp.get('occupation');

                    return <Box key={key} modifier="hairline">
                        <Text element="p" modifier="strong">pets[{key}]</Text>

                        <Text element="p">
                            <Label className="marginRight">name</Label>
                            <Input modifier="text" {...name.spread()} />
                        </Text>

                        <Text element="p">
                            <Label className="marginRight">occupation</Label>
                            <Input modifier="text" {...occupation.spread()} />
                        </Text>

                        <Text element="p">
                            <Button>^</Button>
                            <Button>v</Button>
                            <Button>x</Button>
                        </Text>
                    </Box>;
                })}

                <Button onClick={() => pets.onChange([...pets.value(), newPet])}>Add pet</Button>
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
