// @flow
import React from 'react';
import type {Node} from 'react';
import Parcel from 'parcels';

import shallowEquals from 'unmutable/lib/shallowEquals';

type RenderFunction = (parcel: Parcel) => Node;

type Props = {
    children: RenderFunction,
    forceUpdate?: Array<*>,
    parcel: Parcel
};

export default class PureParcel extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Object): boolean {
        let parcelDataChanged: boolean = !this.props.parcel.equals(nextProps.parcel);
        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate || [])(nextProps.forceUpdate || []);
        return parcelDataChanged || forceUpdateChanged;
    }

    debugRenderStyle: Function = (): Object => {
        let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
        return {
            backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
            padding: "1rem",
            marginBottom: "1rem"
        };
    };

    render(): Node {
        let {children, parcel} = this.props;
        let element = children(parcel);
        if(parcel._treeshare.getDebugRender()) {
            return <div style={this.debugRenderStyle()}>{element}</div>;
        }
        return element;
    }
}
