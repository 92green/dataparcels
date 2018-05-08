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
        let withParcelValue = ({parcel, forceUpdate = []}) => ({
            ...parcel.data(),
            ...forceUpdate
        });

        let aa = withParcelValue(this.props);
        let bb = withParcelValue(nextProps);
        return !shallowEquals(aa)(bb);
    }

    render(): Node {
        let {children, parcel} = this.props;
        return children(parcel);
    }
}
