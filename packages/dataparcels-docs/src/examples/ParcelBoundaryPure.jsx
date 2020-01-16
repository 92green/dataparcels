import React from 'react';
import useParcelState from 'react-dataparcels/useParcelState';
import ParcelBoundary from 'react-dataparcels/ParcelBoundary';
import exampleFrame from 'component/exampleFrame';

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

export default function PersonEditor(props) {

    let [personParcel] = useParcelState({
        value: {
            name: {
                first: "Robert",
                last: "Clamps"
            },
            age: "33",
            height: "160"
        }
    });

    return exampleFrame({personParcel}, <div>
        <label>name</label>
        <ParcelBoundary parcel={personParcel.get('name')}>
            {(name) => <DebugRender>
                <label>first</label>
                <ParcelBoundary parcel={name.get('first')}>
                    {(first) => <DebugRender>
                        <input type="text" {...first.spreadInput()} />
                    </DebugRender>}
                </ParcelBoundary>

                <label>last</label>
                <ParcelBoundary parcel={name.get('last')}>
                    {(last) => <DebugRender>
                        <input type="text" {...last.spreadInput()} />
                    </DebugRender>}
                </ParcelBoundary>
            </DebugRender>
        }
        </ParcelBoundary>

        <label>age</label>
        <ParcelBoundary parcel={personParcel.get('age')}>
            {(age) => <DebugRender>
                <input type="text" {...age.spreadInput()} />
            </DebugRender>}
        </ParcelBoundary>
    </div>);
}
