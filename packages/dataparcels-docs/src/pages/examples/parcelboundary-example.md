import Link from 'gatsby-link';
import ParcelBoundaryExample from 'examples/ParcelBoundaryExample';

This example demonstrates nested ParcelBoundaries and their pure rendering feature. ParcelBoundaries appear as coloured boxes. As you type in an input, the colours will change to indicate which ParcelBoundaries have re-rendered. 

<Link to="/api/ParcelBoundary">API reference for ParcelBoundary</Link>

<ParcelBoundaryExample />

```js
import React from 'react';
import {ParcelHoc, ParcelBoundary} from 'react-dataparcels';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        name: {
            first: "Robert",
            last: "Clamps"
        },
        age: "33"
    }),
    debugRender: true
});

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <label>name</label>
        <ParcelBoundary parcel={personParcel.get('name')}>
            {(name) => <div>
                <label>first</label>
                <ParcelBoundary parcel={name.get('first')}>
                    {(first) => <input type="text" {...first.spreadDOM()} />}
                </ParcelBoundary>
                
                <label>last</label>
                <ParcelBoundary parcel={name.get('last')}>
                    {(last) => <input type="text" {...last.spreadDOM()} />}
                </ParcelBoundary>
            </div>
        }
        </ParcelBoundary>

        <label>age</label>
        <ParcelBoundary parcel={personParcel.get('age')}>
            {(age) => <input type="text" {...age.spreadDOM()} />}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(PersonEditor);
```
