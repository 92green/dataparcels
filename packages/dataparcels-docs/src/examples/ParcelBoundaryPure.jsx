import React from 'react';
import ParcelHoc from 'react-dataparcels/ParcelHoc';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import ExampleHoc from 'component/ExampleHoc';

const PersonParcelHoc = ParcelHoc({
    name: "personParcel",
    valueFromProps: (/* props */) => ({
        name: {
            first: "Robert",
            last: "Clamps"
        },
        age: "33",
        height: "160"
    })
});

const DebugRender = ({children}) => {
    // each render, have a new, random background colour
    let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
    let style = {
        backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
        padding: "1rem",
        marginBottom: "1rem"
    };
    return <div style={style}>{children}</div>;
};

const PersonEditor = (props) => {
    let {personParcel} = props;
    return <div>
        <label>name</label>
        <ParcelBoundary parcel={personParcel.get('name')}>
            {(name) => <DebugRender>
                <label>first</label>
                <ParcelBoundary parcel={name.get('first')}>
                    {(first) => <DebugRender>
                        <input type="text" {...first.spreadDOM()} />
                    </DebugRender>}
                </ParcelBoundary>

                <label>last</label>
                <ParcelBoundary parcel={name.get('last')}>
                    {(last) => <DebugRender>
                        <input type="text" {...last.spreadDOM()} />
                    </DebugRender>}
                </ParcelBoundary>
            </DebugRender>
        }
        </ParcelBoundary>

        <label>age</label>
        <ParcelBoundary parcel={personParcel.get('age')}>
            {(age) => <DebugRender>
                <input type="text" {...age.spreadDOM()} />
            </DebugRender>}
        </ParcelBoundary>
    </div>;
};

export default PersonParcelHoc(ExampleHoc(PersonEditor));
