import React from 'react';
import Parcel, {PureParcel} from 'parcels-react';
import ParcelsPluginForm from 'parcels-plugin-form';

import example from '../components/Example';

import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

const desc = `
# 4. Forms

While parcels is useful for any kind of user input, capturing user input in forms is a common use case with a specific set of formy needs.

Here's where I try to make parcels-plugin-form...
`;

export default class ExampleMeta extends React.Component {
    constructor(props) {
        super(props);

        let lunch = new Parcel({
            value: {
                name: "",
                email: "",
                food: {
                    type: "Apples",
                    quantity: "1"
                },
                pets: [
                    {name: "Gustav"},
                    {name: ""}
                ]
            },
            handleChange: (lunch) => this.setState({lunch}),
            debugRender: true
        });

        this.state = {
            lunch
        };
    }

    render() {
        let isRequired = (value) => value.trim() ? null : "This field is required";
        let isEmail = (value) => /.+@.+\..+/.test(value) ? null : "This field must contain an email address";
        let isQuantity = (value) => /^\d+$/.test(value) ? null : "This field must contain a whole number";

        let lunch = this.state.lunch.modify(
            ParcelsPluginForm({
                onSubmit: (value) => {
                    console.log("submitted:", value);
                },
                onError: (errors) => {
                    console.log("errors", errors);
                },
                validators: (parcel) => ({
                    "name": [isRequired],
                    "email": [isRequired, isEmail],
                    "food.type": [isRequired],
                    "food.quantity": [isRequired, isQuantity],
                    "pets.*.name": [isRequired]
                })
            })
        );

        console.log(lunch.meta());

        let renderError = (parcel) => {
            let {error} = parcel.meta();
            if(/*lunch.meta().attemptedSubmit && */error) {
                return <p className="Text Text-failure Text-margin">{error}</p>;
            }
        };

        return example(this, desc, <div>

            <PureParcel parcel={lunch.get('name')}>
                {(name) => <div>
                    <label className="Label">what is your name?</label>
                    <input className="Input" type="text" {...name.spreadDOM()} />
                    {renderError(name)}
                    {"dispatched: " + name.hasDispatched()}
                </div>}
            </PureParcel>

            <PureParcel parcel={lunch.get('email')}>
                {(email) => <div>
                    <label className="Label">what is your email?</label>
                    <input className="Input" type="tel" {...email.spreadDOM()} />
                    {renderError(email)}
                </div>}
            </PureParcel>

            <PureParcel parcel={lunch.getIn(['food', 'type'])}>
                {(type) => <div>
                    <label className="Label">what type of food would you like?</label>
                    <input className="Input" type="text" {...type.spreadDOM()} />
                    {renderError(type)}
                </div>}
            </PureParcel>

            <PureParcel parcel={lunch.getIn(['food', 'quantity'])}>
                {(quantity) => <div>
                    <label className="Label">how many would you like?</label>
                    <input className="Input" type="tel" {...quantity.spreadDOM()} />
                    {renderError(quantity)}
                </div>}
            </PureParcel>

            {/*lunch.get('pets').toArray((pet) => {
                return <PureParcel parcel={pet} key={pet.key()}>
                    {(pet) => {
                        let name = pet.get('name');
                        return <div>
                            <label className="Label">Pet name</label>
                            <input className="Input" type="tel" {...name.spreadDOM()} />
                            {renderError(name)}
                        </div>;
                    }}
                </PureParcel>;
            })*/}

            <button className="Button Button-primary" onClick={lunch.meta().submit}>Submit</button>
        </div>);
    }
}
