# parcels

*Super-duper for React user inputs and forms!™*

Parcels wrap up values and the functions that change them, and provides a set of chainable methods for splitting and iterating over your data.

Early days yet, stay tuned.

## Example

```
import React from 'react';
import Parcel from 'parcels';

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            value: {
                firstname: "Breep",
                lastname: "Clamperton",
                address: {
                    streetAddress: "10 Spaldercombs Ave",
                    postcode: "3456"
                }
            }
        };
    }

    handleChange(payload) {
        this.setState({
            value: payload
        });
    }

    render() {
        var parcel = Parcel(
            this.state.value,
            this.handleChange
        );

        return <div>
            <p>
                <label className="marginRight">firstname</label>
                <input type="text" {...parcel.get('firstname').spread()} />
            </p>

            <p>
                <label className="marginRight">lastname</label>
                <input type="text" {...parcel.get('lastname').spread()} />
            </p>

            <p>
                <label className="marginRight">address.streetAddress</label>
                <input type="text" {...parcel.getIn(['address', 'streetAddress']).spread()} />
            </p>

            <p>
                <label className="marginRight">address.postcode</label>
                <input type="text" {...parcel.getIn(['address', 'postcode']).modify(ii => `${ii}`, ii => ii.replace(/[^0-9]/g, '')).spread()} />
            </p>
        </div>;
    }
}

```
