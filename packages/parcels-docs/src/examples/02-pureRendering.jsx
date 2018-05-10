import React from 'react';
import Parcel, {PureParcel} from 'parcels-react';
import example from '../components/Example';

const desc = `
# 2. Simple Objects with Pure Rendering

Before we go any further, if you're using parcels with React you'll care about render performance. By default all parcels in the tree will always re-render. This can be bad for render performance. The \`PureParcel\` component will only re-render when the \`parcel\` passed into it changes its data*.

The colors in the example below will change on each re-render to demonstrate which elements are being re-rendered.

**Using PureParcel is VERY recommended.**

* *You can force a \`PureParcel\` to update in response to other prop changes by giving it a prop of \`forceUpdate\`. This should be an array. Each element in the array will be checked for strict equality on \`shouldComponentUpdate\`, and the \`PureParcel\` will update if any of the elements have changed.*
`;

export default class ExamplePureRendering extends React.Component {
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

    randomBackground: Function = () => {
        let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
        return {
            backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
            padding: "1rem",
            marginBottom: "1rem"
        };
    };

    render() {
        let {person} = this.state;
        return example(this, desc, <div>

            <PureParcel parcel={person.get('firstname')}>
                {(firstname) => <div style={this.randomBackground()}>
                    <label className="Label">firstname</label>
                    <input className="Input" type="text" {...firstname.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.get('lastname')}>
                {(lastname) => <div style={this.randomBackground()}>
                    <label className="Label">lastname</label>
                    <input className="Input" type="text" {...lastname.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.getIn(['address', 'streetAddress'])}>
                {(streetAddress) => <div style={this.randomBackground()}>
                    <label className="Label">street address</label>
                    <input className="Input" type="text" {...streetAddress.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.getIn(['address', 'city'])}>
                {(city) => <div style={this.randomBackground()}>
                    <label className="Label">city</label>
                    <input className="Input" type="text" {...city.spreadDOM()} />
                </div>}
            </PureParcel>

        </div>);
    }
}
