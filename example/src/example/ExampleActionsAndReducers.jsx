import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';

export default class ExampleActionsAndReducers extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                firstname: "Killie",
                lastname: "Oberst",
                address: {
                    suburb: "Fothersville"
                },
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
            }
        };
    }

    handleChange(payload, action) {
        console.log("action", action);
        this.setState(payload);
    }

    render() {
        var person = Parcel(
            this.state,
            this.handleChange
        );

        const description = <Box>
            <Paragraph>ACTION!.</Paragraph>
        </Box>;

        const newPet = () => ({
            value: {
                name: "",
                animal: ""
            },
            meta: {
                test: "?"
            }
        });

        var pets = person.get('pets');

        return <Example
            title="Actions and Reducers"
            state={this.state}
            description={description}
            source={this.props.source}
        >
            <div>
                <label className="Label">firstname</label>
                <input className="Input" type="text" {...person.get('firstname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <input className="Input" type="text" {...person.get('lastname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">address.suburb</label>
                <input className="Input" type="text" {...person.getIn(['address', 'suburb']).spreadDOM()} />
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

                <button className="Button Button-inline" onClick={() => pets.push(newPet())}>Add pet</button>
            </div>

        </Example>;
    }
}
