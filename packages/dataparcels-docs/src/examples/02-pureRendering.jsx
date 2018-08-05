import React from 'react';
import Parcel, {PureParcel} from 'react-dataparcels';
import example from '../components/Example';

const desc = `
# 2. Simple Objects with Pure Rendering

Before we go any further, if you're using parcels with React you'll care about render performance. By default all parcels in the tree will always re-render. This can be bad for render performance. The \`PureParcel\` component will only re-render when the \`parcel\` passed into it changes its data*.

The colors in the example below will change on each re-render to demonstrate which elements are being re-rendered. You can turn this on in your own apps by passing \`debugRender: true\` to your Parcel's config.

\`ParcelPure\` can also debounce your changes to keep your text inputs feeling snappy and responsive. Pass it a \`debounce\` prop with the number of milliseconds you want to debounce.

**Using PureParcel is VERY recommended.**

* *You can force a \`PureParcel\` to update in response to other prop changes by giving it a prop of \`forceUpdate\`. This should be an array. Each element in the array will be checked for strict equality on \`shouldComponentUpdate\`, and the \`PureParcel\` will update if any of the array elements have changed.*
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
            handleChange: (person) => this.setState({person}),
            debugRender: true
        });

        this.state = {
            person
        };
    }

    render() {
        let {person} = this.state;
        return example(this, desc, <div>

            <PureParcel parcel={person.get('firstname')}>
                {(firstname) => <div>
                    <label className="Label">firstname</label>
                    <input className="Input" type="text" {...firstname.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.get('lastname')}>
                {(lastname) => <div>
                    <label className="Label">lastname</label>
                    <input className="Input" type="text" {...lastname.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.getIn(['address', 'streetAddress'])}>
                {(streetAddress) => <div>
                    <label className="Label">street address</label>
                    <input className="Input" type="text" {...streetAddress.spreadDOM()} />
                </div>}
            </PureParcel>

            <PureParcel parcel={person.getIn(['address', 'city'])} debounce={300}>
                {(city) => <div>
                    <label className="Label">city (with 300ms debounce)</label>
                    <input className="Input" type="text" {...city.spreadDOM()} />
                </div>}
            </PureParcel>

        </div>);
    }
}
