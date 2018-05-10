import React from 'react';
import Parcel, {PureParcel} from 'parcels-react';
import example from '../components/Example';

import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

const desc = `
# 4. Forms

While parcels is useful for any kind of user input, capturing user input in forms is a common use case with a specific set of formy needs.

Here's where I try to make parcels-modifier-form...
`;

const AddSubmitModifier = () => (parcel) => {
    let ref = {};

    let newParcel = parcel.initialMeta({
        submitted: false,
        submit: () => ref.submit()
    });

    ref.submit = () => {
        newParcel.refresh();
        newParcel.setMeta({
            submitted: true
        });
    };

    return newParcel;
};

const AddTouchedModifier = (match = "") => (parcel) => {
    return parcel.addModifier({
        modifier: ii => ii.modifyChange(({parcel, continueChange}) => {
            parcel.setMeta({
                touched: true
            });
            continueChange();
        }),
        match
    })
};

const AddOriginalValueModifier = (match = "") => (parcel) => {
    return parcel.addModifier({
        modifier: ii => ii.initialMeta({
            originalValue: parcel.value()
        }),
        match: match || "**/*:!Parent"
    });
};

const AddDirtyModifier = (match = "") => (parcel) => {
    return parcel.addModifier({
        modifier: ii => ii.modifyChange(({parcel, continueChange, newParcelData}) => {
            parcel.setMeta({
                dirty: newParcelData.value !== newParcelData.meta.originalValue
            });
            continueChange();
        }),
        match: match || "**/*:!Parent"
    });
};

const AddValidModifier = (validators) => (parcel) => {
    return pipeWith(
        validators,
        reduce((parcel, validatorArray, match) => {
            return parcel.addModifier({
                modifier: ii => ii.modifyChange(({parcel, continueChange, newParcelData}) => {
                    parcel.setMeta({
                        error: pipeWith(
                            validatorArray,
                            reduce((error, validator) => {
                                if(error) {
                                    return error;
                                }
                                return validator(newParcelData.value)
                            }, null)
                        )
                    });
                    continueChange();
                }),
                match
            });
        }, parcel)
    );
};

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
                }
            },
            handleChange: (lunch) => this.setState({lunch})
        });

        this.state = {
            lunch
        };
    }

    render() {
        let isRequired = (value) => value.trim() ? null : "This field is required";
        let isEmail = (value) => /.+@.+\..+/.test(value) ? null : "This field must contain an email address";
        let isQuantity = (value) => /^\d+$/.test(value) ? null : "This field must contain a whole number";

        let lunch = this.state.lunch
            .modify(AddSubmitModifier())
            .modify(AddTouchedModifier())
            .modify(AddOriginalValueModifier())
            .modify(AddDirtyModifier())
            .modify(AddValidModifier({
                "name": [isRequired],
                "email": [isRequired, isEmail],
                "food.type": [isRequired],
                "food.quantity": [isRequired, isQuantity]
            }));

        console.log("lunch", lunch._typedPathString());

        let renderError = (parcel) => {
            let error = parcel.meta('error');
            if(lunch.meta('submitted') && error) {
                return <p className="Text Text-failure Text-margin">{error}</p>;
            }
        };

        return example(this, desc, <div>

            <PureParcel parcel={lunch.get('name')}>
                {(name) => <div>
                    <label className="Label">what is your name?</label>
                    <input className="Input" type="text" {...name.spreadDOM()} />
                    {renderError(name)}
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

            <button className="Button Button-primary" onClick={lunch.meta('submit')}>Submit</button>
        </div>);
    }
}
