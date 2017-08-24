import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, Paragraph} from 'obtuse';

export default class ExampleDeepObject extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                mother: {
                    firstname: "Clavier",
                    lastname: "Torvey"
                },
                father: {
                    firstname: "Accutane",
                    lastname: "Torvey"
                }
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

        const description = <Box>
            <Paragraph>You can create parcels from properties of nested objects by using <Code>.getIn()</Code>.</Paragraph>
        </Box>;

        return <Example
            title="Deep Object"
            description={description}
            state={this.state}
        >
            <div>
                <label className="Label">mother.firstname</label>
                <input className="Input" type="text" {...parcel.getIn(['mother', 'firstname']).spreadDOM()} />
            </div>
            <div>
                <label className="Label">mother.lastname</label>
                <input className="Input" type="text" {...parcel.getIn(['mother', 'lastname']).spreadDOM()} />
            </div>
            <div>
                <label className="Label">father.firstname</label>
                <input className="Input" type="text" {...parcel.getIn(['father', 'firstname']).spreadDOM()} />
            </div>
            <div>
                <label className="Label">father.lastname</label>
                <input className="Input" type="text" {...parcel.getIn(['father', 'lastname']).spreadDOM()} />
            </div>
        </Example>;
    }
}
