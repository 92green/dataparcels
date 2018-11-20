import React from 'react';
import {ParcelHoc} from 'react-dataparcels';
import ExampleHoc from 'component/ExampleHoc';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    valueFromProps: (props) => props.name,
    onChange: (props) => (value) => props.onChangeName(value),
    shouldParcelUpdateFromProps: (prevValue, nextValue) => prevValue !== nextValue
});

const NameEditor = (props) => {
    let {name, nameParcel} = props;
    return <div>
        <div>Higher-up state: {name}</div>
        <input type="text" {...nameParcel.spreadDOM()} />
    </div>;
};

const UpdateFromPropsExample = NameParcelHoc(ExampleHoc(NameEditor));

export default class ParcelHocUpdateFromPropsExample extends React.Component {

    state = {
        name: "George"
    };

    render() {
        let {name} = this.state;
        let onChangeName = (newName) => this.setState({
            name: newName
        });

        return <UpdateFromPropsExample
            name={name}
            onChangeName={onChangeName}
        />;
    }
}
