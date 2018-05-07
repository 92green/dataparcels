import React from 'react';
import Parcel from 'parcels';
import example from '../components/Example';

const copy = `
# Simple Object

Here's a parcel that contains an object.
`;

export default class ExampleObject extends React.Component {
    constructor(props) {
        super(props);

        let person = new Parcel({
            value: {
                firstname: "Breep",
                lastname: "Clamperton"
            },
            handleChange: (person) => this.setState({person})
        });

        this.state = {
            person
        };
    }

    render() {
        let {person} = this.state;
        return example(this, copy, <div>
            <div>
                <label className="Label">firstname</label>
                <input className="Input" type="text" {...person.get('firstname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <input className="Input" type="text" {...person.get('lastname').spreadDOM()} />
            </div>
        </div>);
    }
}