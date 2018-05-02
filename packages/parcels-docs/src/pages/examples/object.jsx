import React from 'react';
import Parcel from 'parcels';
/*nosrc*/
import {Box, Code, Paragraph} from 'obtuse';
import Example from '../../components/Example';
/*endnosrc*/

export default class ExampleSimpleObject extends React.Component {
    constructor(props) {
        super(props);

        let parcel = new Parcel({
            value: {
                firstname: "Breep",
                lastname: "Clamperton"
            },
            handleChange: (parcel) => this.setState({parcel})
        });

        this.state = {parcel};
    }

    render() {
        let {parcel} = this.state;
        /*nosrc*/
        const description = <Box>
            <Paragraph>Creates a parcel and allows you to change property values on the parcel. It uses the <Code>.get()</Code> method to create parcels for <Code>firstname</Code> and <Code>lastname</Code> before spreading the <Code>value</Code> and <Code>onChange</Code> onto the inputs.</Paragraph>
        </Box>;
        /*endnosrc*/

        return /*nosrc*/<Example
            title="Simple Object"
            description={description}
            state={this.state}
            source={this.props.source}
        >{/*endnosrc*/}<div>
            <div>
                <label className="Label">firstname</label>
                <input className="Input" type="text" {...parcel.get('firstname').spreadDOM()} />
            </div>
            <div>
                <label className="Label">lastname</label>
                <input className="Input" type="text" {...parcel.get('lastname').spreadDOM()} />
            </div>
        </div>{/*nosrc*/}</Example>/*endnosrc*/;
    }
}
