import React from 'react';
import Parcel, {PureParcel} from 'react-dataparcels';

export default class HelloWorldWithOwnState extends React.Component {
    constructor(props) {
        super(props);

        let person = new Parcel({
            value: {
                firstname: "Robert",
                lastname: "Clamps"
            },
            handleChange: (person) => this.setState({person})
        });

        this.state = {person};
    }

    render() {
        let {person} = this.state;
        return <div>
            <PureParcel parcel={person.get('firstname')}>
                {(firstname) => <div>
                    <label>firstname</label>
                    <input type="text" {...firstname.spreadDOM()} />
                </div>}
            </PureParcel>
            <PureParcel parcel={person.get('lastname')}>
                {(lastname) => <div>
                    <label>lastname</label>
                    <input type="text" {...lastname.spreadDOM()} />
                </div>}
            </PureParcel>
        </div>;
    }
}
