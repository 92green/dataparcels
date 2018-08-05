import React from 'react';
import Parcel from 'react-dataparcels';
import example from '../components/Example';

const desc = `
# 1. Simple Objects

First things first. Here's a parcel that contains an object or two. Type in the fields below and watch the state update.

A new parcel is created with a \`value\` and a \`handleChange\` function, which is then stored in state. The \`.get()\` and \`getIn()\` methods are used to create child parcels. For instance, \`person.get('firstname')\` will return a parcel with an initial value of "Breep". \`.spreadDOM()\` is then spread onto the inputs, providing the inputs with \`value\` and \`onChange\` props.
`;

export default class ExampleSimpleObjects extends React.Component {
    constructor(props) {
        super(props);

        let person = new Parcel({
            value: {
                firstname: "Breep",
                lastname: "Clamperton",
                address: {
                    streetAddress: "123 Fake St",
                    city: "Floopsville"
                }
            },
            handleChange: (person) => this.setState({person})
        });

        this.state = {
            person
        };
    }

    render() {
        let {person} = this.state;
        return example(this, desc, <div>
            <div>
                <label className="Label">firstname</label>
                <input className="Input" type="text" {...person.get('firstname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <input className="Input" type="text" {...person.get('lastname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">street address</label>
                <input className="Input" type="text" {...person.getIn(['address', 'streetAddress']).spreadDOM()} />
            </div>
            <div>
                <label className="Label">city</label>
                <input className="Input" type="text" {...person.getIn(['address', 'city']).spreadDOM()} />
            </div>
        </div>);
    }
}
