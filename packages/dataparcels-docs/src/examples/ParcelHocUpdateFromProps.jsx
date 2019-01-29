import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ExampleHoc from 'component/ExampleHoc';
import {Box} from 'dcme-style';

const NameParcelHoc = ParcelHoc({
    name: "nameParcel",
    valueFromProps: (props) => props.name,
    onChange: (props) => (value) => props.onChangeName(value),
    shouldParcelUpdateFromProps: (prevProps, nextProps, valueFromProps) => {
        return valueFromProps(prevProps) !== valueFromProps(nextProps);
    }
});

const NameEditor = (props) => {
    let {nameParcel} = props;
    return <div>
        <label>edit parcel state</label>
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

        return <Box modifier="example marginBottomKilo">
            <Box modifier="exampleInner paddingKilo">
                <p>Higher-up state: {name}</p>
                <label>edit higher-up state directly</label>
                <input value={name} onChange={(e) => onChangeName(e.currentTarget.value)} />
                <Box modifier="paddingLeftKilo paddingRightKilo">
                    <UpdateFromPropsExample
                        name={name}
                        onChangeName={onChangeName}
                    />
                </Box>
            </Box>
        </Box>;
    }
}
