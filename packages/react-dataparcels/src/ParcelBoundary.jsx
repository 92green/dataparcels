// @flow
import type {Node} from 'react';
import type Parcel from 'dataparcels';
import type ParcelBufferControl from './ParcelBufferControl';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useMemo is a named export of react
import {useMemo} from 'react';
import useParcelBuffer from './useParcelBuffer';

type RenderFunction = (parcel: Parcel, buffer: ParcelBufferControl) => Node;

type Props = {
    parcel: Parcel,
    children: RenderFunction,
    pure?: boolean,
    forceUpdate?: any[],
    debounce?: number,
    hold?: boolean,
    modifyBeforeUpdate?: ParcelValueUpdater|ParcelValueUpdater[],
    keepValue?: boolean
};

export default function ParcelBoundary(props: Props): Node {
    let {
        parcel,
        children,
        pure = true,
        forceUpdate = [],
        debounce = 0,
        hold = false,
        modifyBeforeUpdate = [],
        keepValue = false
    } = props;

    let [innerParcel, parcelBufferControl] = useParcelBuffer({
        parcel,
        debounce,
        hold,
        modifyBeforeUpdate,
        keepValue
    });

    let renderChildren = () => children(innerParcel, parcelBufferControl);

    let memoed = useMemo(
        () => pure && renderChildren(),
        [innerParcel, ...forceUpdate]
    );

    return pure ? memoed : renderChildren();
}
