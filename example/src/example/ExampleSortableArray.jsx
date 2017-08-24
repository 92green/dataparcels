import React from 'react';
import Parcel from 'parcels';
import Example from '../component/Example';
import {Box, Code, List, ListItem, Paragraph, Text} from 'obtuse';

export default class ExampleSortableArray extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: ["A", "B", "C"]
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

        </Box>;

        return <Example
            title="Sortable Array"
            state={this.state}
            description={description}
        >
            {parcel.map((itemParcel, key) => {
                return <div key={key}>
                    <label className="Label">item {key}</label>
                    <input className="Input" type="text" {...itemParcel.spreadDOM()} />
                </div>;
            }).value()}
        </Example>;
    }
}
