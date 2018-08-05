import Link from 'gatsby-link';
import HelloWorld from 'examples/HelloWorld';
import HelloWorldRaw from 'raw-loader!examples/HelloWorld';

# Getting Started

## Installation

If you'd like to use `dataparcels` with React:

```js
yarn add react-dataparcels
- or -
npm install react-dataparcels --save
```

If you'd like to use `dataparcels` *without* React:

```js
yarn add dataparcels
- or -
npm install dataparcels --save
```

## Hello World

Here's an example that imports `dataparcels`, and creates a React UI to allow editing of the following data structure:

```js
{
    firstname: "Robert",
    lastname: "Clamps"
}
```

```js
import React from 'react';
import Parcel, {ParcelStateHock, PureParcel} from 'react-dataparcels';

const PersonParcelHoc = ParcelStateHock({
    initialValue: (/* props */) => ({
        firstname: "Robert",
        lastname: "Clamps"
    }),
    prop: "personParcel"
});

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <PureParcel parcel={personParcel.get('firstname')} debounce={100}>
            {(firstname) => <div>
                <label>firstname</label>
                <input type="text" {...firstname.spreadDOM()} />
            </div>}
        </PureParcel>
        <PureParcel parcel={personParcel.get('lastname')} debounce={100}>
            {(lastname) => <div>
                <label>lastname</label>
                <input type="text" {...lastname.spreadDOM()} />
            </div>}
        </PureParcel>
    </div>;
};

export default PersonParcelHoc(PersonEditor);

```

<HelloWorld />
