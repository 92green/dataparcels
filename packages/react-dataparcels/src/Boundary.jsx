// @flow
import type {Node} from 'react';
import type Parcel from 'dataparcels';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useMemo is a named export of react
import {useMemo} from 'react';
import useBuffer from './useBuffer';

type RenderFunction = (parcel: Parcel) => Node;

type Props = {
    source: Parcel,
    children: RenderFunction,
    dependencies?: any[],
    buffer?: number|boolean,
    derive?: ParcelValueUpdater,
    memo?: boolean
};

export default function Boundary(props: Props): Node {
    let {
        source,
        children,
        dependencies = [],
        buffer = false,
        derive,
        memo = true
    } = props;

    let innerParcel = useBuffer({
        source,
        buffer,
        derive
    });

    let renderChildren = () => children(innerParcel);

    let memoed = useMemo(
        () => memo && renderChildren(),
        [innerParcel, ...dependencies]
    );

    return memo ? memoed : renderChildren();
}
