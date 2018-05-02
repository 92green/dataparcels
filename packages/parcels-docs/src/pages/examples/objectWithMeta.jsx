import React from 'react';
import Parcel from 'parcels';
/*nosrc*/
import Example from '../../components/Example';
import {Box, Code, Paragraph} from 'obtuse';
/*endnosrc*/

export default class ExampleObjectWithMeta extends React.Component {
    constructor(props) {
        super(props);
        let parcel = new Parcel({
            value: {
                address: "12 Hammy Grove",
                email: "pumpersnipe@eudoramail.com"
            },
            // meta: {
            //     correct: {
            //         address: true,
            //         email: false
            //     }
            // },
            handleChange: (parcel) => this.setState({parcel})
        });

        this.state = {parcel};
    }

    render() {
        let {parcel} = this.state;
        /*nosrc*/
        const description = <Box>
            <Paragraph>It's common to need to store metadata related to values in forms, such as whether a value is valid, whether a user has touched a field etc. Parcels can store <Code>meta</Code> against each parcel in the tree.</Paragraph>
            {/*<Paragraph>
                <Code>Meta</Code> is an object with named keys, and the value on each key should be the same shape as your <Code>value</Code> data structure.</Paragraph>
            <Paragraph>Pass in a <Code>meta</Code> object in your <Code>parcelData</Code> to set the meta.</Paragraph>
            <Paragraph>Use <Code>.meta(key)</Code> to retrieve your meta.</Paragraph>
            <Paragraph>Change your meta by calling <Code>.meta(key)(newMetaValue)</Code>. Just like <Code>.onChange()</Code>, it wont change the value directly, but will call the parcel's <Code>handleChange</Code> function with the new meta in it.</Paragraph>*/}
        </Box>;
        /*endnosrc*/

        let address = parcel.get('address');
        let email = parcel.get('email');

        return /*nosrc*/<Example
            title="Object with Meta"
            description={description}
            state={this.state}
            source={this.props.source}
        >{/*endnosrc*/}<div>
            <div className="marginBottom2">
                <label className="Label">address</label>
                <input className="Input" type="text" {...address.spreadDOM()} />
                <span className="Text Text--Button">Is this correct? {address.meta('correct') ? 'true' : 'false'}</span>
                <button className="Button Button-inline" onClick={() => address.setMeta({correct: true})}>Set to true</button>
                <button className="Button Button-inline" onClick={() => address.setMeta({correct: false})}>Set to false</button>
            </div>
            <div className="marginBottom2">
                <label className="Label">email</label>
                <input className="Input" type="text" {...email.spreadDOM()} />
                <span className="Text Text--Button">Is this correct? {email.meta('correct') ? 'true' : 'false'}</span>
                <button className="Button Button-inline" onClick={() => address.setMeta({correct: true})}>Set to true</button>
                <button className="Button Button-inline" onClick={() => address.setMeta({correct: false})}>Set to false</button>
            </div>
        </div>{/*nosrc*/}</Example>/*endnosrc*/;
    }
}
