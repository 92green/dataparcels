import React from 'react';
import Parcel from 'parcels';
/*nosrc*/
import {Box, Code, Paragraph} from 'obtuse';
import Example from '../component/Example';
/*endnosrc*/

export default class ExampleModify extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                postcode: "",
                date: new Date(2018, 1, 1)
            }
        };
    }

    handleChange(payload) {
        this.setState(payload);
    }

    render() {
        var parcel = Parcel(
            this.state,
            this.handleChange
        );
        /*nosrc*/
        const description = <Box>
            <Paragraph>Parcels can modify values on the way down using <Code>.modifyValue()</Code>, and on the way back up using <Code>.modifyChange()</Code>. These methods each return a new modified parcel. They are useful for limiting and altering user input.</Paragraph>
            <Paragraph>In the first example, <Code>postcode</Code> uses <Code>.modifyChange()</Code> to only allow number characters as input.</Paragraph>
            <Paragraph>In the second example, <Code>date</Code> turns a <Code>Date</Code> object into a year string on the way down, and turns it back into a <Code>Date</Code> object on the way up again.</Paragraph>
        </Box>;
        /*endnosrc*/

        var postcode = parcel
            .get('postcode')
            .modifyChange(newValue => newValue.replace(/[^0-9]/g, ''));

        var date = parcel
            .get('date')
            .modifyValue(value => value.getFullYear())
            .modifyChange(newValue => new Date(newValue, 1, 1));

        return /*nosrc*/<Example
            title="Modifying Data"
            description={description}
            state={this.state}
            source={this.props.source}
        >{/*endnosrc*/}<div>
            <div>
                <label className="Label">postcode</label>
                <input className="Input" type="text" {...postcode.spreadDOM()} />
            </div>
            <div>
                <label className="Label">date</label>
                <select className="Select" {...date.spreadDOM()}>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                </select>
            </div>
        </div>{/*nosrc*/}</Example>/*endnosrc*/;
    }
}
