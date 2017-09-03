import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';

export default class ExampleComplexNesting extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: [
                {
                    firstname: "Killie",
                    lastname: "Oberst",
                    pets: [
                        {
                            name: "Yoghurt",
                            animal: "Dog"
                        },
                        {
                            name: "Simpson",
                            animal: "Yak"
                        }
                    ]
                },
                {
                    firstname: "Amanda",
                    lastname: "Hobbleston",
                    pets: [
                        {
                            name: "Klepto",
                            animal: "Fish"
                        }
                    ]
                }
            ]
        };
    }

    handleChange(payload) {
        this.setState(payload);
    }

    render() {
        var people = Parcel(
            this.state,
            this.handleChange
        );

        const description = <Box>
            <Paragraph>This example demonstrates how a complex data structure containing nested arrays may be edited.</Paragraph>
        </Box>;

        const newPerson = () => ({
            firstname: "",
            lastname: "",
            pets: []
        });

        const newPet = () => ({
            name: "",
            animal: ""
        });

        return <Example
            title="Complex Nesting"
            state={this.state}
            description={description}
            source={this.props.source}
        >
            {people.map((person, index) => {
                var pets = person.get('pets');

                return <div key={person.key()} className="Box Box-padding Box-hairline Box-marginBottom">
                    <div className="Grid Grid-auto">
                        <div className="Grid_column Grid_column-always">
                            <div>
                                <label className="Label">firstname</label>
                                <input className="Input" type="text" {...person.get('firstname').spreadDOM()} />
                            </div>
                            <div>
                                <label className="Label">lastname</label>
                                <input className="Input" type="text" {...person.get('lastname').spreadDOM()} />
                            </div>
                        </div>
                        <div className="Grid_column Grid_column-always Grid_column-shrink">
                            <button className="Button Button-inline" onClick={() => people.swapPrev(index)}>^</button>
                            <button className="Button Button-inline" onClick={() => people.swapNext(index)}>v</button>
                            <button className="Button Button-inline" onClick={() => people.delete(index)}>x</button>
                        </div>
                    </div>

                    <div className="Box Box-hairline Box-padding Box-marginTop">
                        <label className="Label">pets</label>
                        {pets.map((pet, index) => {
                            return <div key={pet.key()}>
                                <div className="Grid Grid-auto">
                                    <div className="Grid_column Grid_column-always">
                                        <label className="Label">name</label>
                                        <input className="Input" type="text" {...pet.get('name').spreadDOM()} />
                                    </div>
                                    <div className="Grid_column Grid_column-always">
                                        <label className="Label">animal</label>
                                        <input className="Input" type="text" {...pet.get('animal').spreadDOM()} />
                                    </div>
                                    <div className="Grid_column Grid_column-always Grid_column-shrink">
                                        <button className="Button Button-inline" onClick={() => pets.swapPrev(index)}>^</button>
                                        <button className="Button Button-inline" onClick={() => pets.swapNext(index)}>v</button>
                                        <button className="Button Button-inline" onClick={() => pets.delete(index)}>x</button>
                                    </div>
                                </div>
                            </div>;
                        }).value()}

                        <button className="Button Button-inline" onClick={() => pets.push({value: newPet()})}>Add pet</button>
                    </div>
                </div>;
            }).value()}

            <button className="Button Button-inline" onClick={() => people.push({value: newPerson()})}>Add person</button>

        </Example>;
    }
}
