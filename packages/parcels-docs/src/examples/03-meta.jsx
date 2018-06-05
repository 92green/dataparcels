import React from 'react';
import Parcel, {PureParcel} from 'parcels-react';
import example from '../components/Example';

const desc = `
# 3. Meta

It's common to need to store metadata related to values in forms, such as whether a value is valid, whether a user has touched a field etc. Parcels can store \`meta\` against each parcel in the tree.
`;

export default class ExampleMeta extends React.Component {
    constructor(props) {
        super(props);

        let details = new Parcel({
            value: {
                address: "12 Hammy Grove",
                email: "pumpersnipe@eudoramail.com"
            },
            handleChange: (details) => this.setState({details})
        });

        this.state = {
            details
        };
    }

    render() {
        let {details} = this.state;

        let address = details
            .get('address')
            .initialMeta({
                correct: true,
                nice: true
            });

        let email = details
            .get('email')
            .initialMeta({
                correct: false
            });

        return example(this, desc, <div>

            <PureParcel parcel={address}>
                {(address) => <div>
                    <label className="Label">address</label>
                    <input className="Input" type="text" {...address.spreadDOM()} />
                    <div>
                        <span className="Text Text-marginRight">Is this correct? {String(address.meta().correct)}</span>
                        <button className="Button Button-inline" onClick={() => address.setMeta({correct: !address.meta().correct})}>Toggle</button>
                    </div>
                    <div>
                        <span className="Text Text-marginRight">Is this a nice place? {String(address.meta().nice)}</span>
                        <button className="Button Button-inline" onClick={() => address.setMeta({nice: !address.meta().nice})}>Toggle</button>
                    </div>
                </div>}
            </PureParcel>

            <PureParcel parcel={email}>
                {(email) => <div>
                    <label className="Label">email</label>
                    <input className="Input" type="text" {...email.spreadDOM()} />
                    <div>
                        <span className="Text Text-marginRight">Is this correct? {String(email.meta().correct)}</span>
                        <button className="Button Button-inline" onClick={() => email.setMeta({correct: !email.meta().correct})}>Toggle</button>
                    </div>
                </div>}
            </PureParcel>

        </div>);
    }
}
