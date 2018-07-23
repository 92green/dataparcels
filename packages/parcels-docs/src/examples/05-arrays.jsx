import React from 'react';
import Parcel, {PureParcel} from 'parcels-react';
import ParcelsPluginForm from 'parcels-plugin-form';

import example from '../components/Example';

import reduce from 'unmutable/lib/reduce';
import pipeWith from 'unmutable/lib/util/pipeWith';

const desc = `
#5. Arrays

Arrays.
`;

export default class ExampleArrays extends React.Component {
    constructor(props) {
        super(props);

        let items = new Parcel({
            value: [
                {name: "a"},
                {name: "b"},
                {name: "c"},
                {name: "d"}
            ],
            handleChange: (items) => this.setState({items})
        });

        this.state = {
            items
        };
    }

    render() {
        let isRequired = (value) => value.trim() ? null : "This field is required";
        let isEmail = (value) => /.+@.+\..+/.test(value) ? null : "This field must contain an email address";
        let isQuantity = (value) => /^\d+$/.test(value) ? null : "This field must contain a whole number";

        let items = this.state.items/*.modifyChange((parcel, changeRequest) => {
            parcel.dispatch(changeRequest);
        });*/

        console.log(items.value());

        return example(this, desc, <div>
            {items.toArray((item) => <PureParcel parcel={item} key={item.key()}>
                {(item) => <div>
                    <label className="Label">Item name</label>
                    <input className="Input" type="tel" {...item.get('name').spreadDOM()} />
                    <button className="Button Button-inline" onClick={() => item.swapPrevWithSelf()}>^</button>
                    <button className="Button Button-inline" onClick={() => item.swapNextWithSelf()}>v</button>
                    <button className="Button Button-inline" onClick={() => item.deleteSelf()}>x</button>
                    <button className="Button Button-inline" onClick={() => item.insertAfterSelf({name: "new"})}>+</button>
                </div>}
            </PureParcel>)}
        </div>);
    }
}
