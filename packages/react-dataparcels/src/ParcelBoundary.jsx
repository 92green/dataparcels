// @flow
import type {Node} from 'react';
import type Parcel from 'dataparcels';
import type {ParcelValueUpdater} from 'dataparcels';

// $FlowFixMe - useMemo is a named export of react
import {useMemo} from 'react';
import useParcelBuffer from './useParcelBuffer';

type RenderFunction = (parcel: Parcel, control: {[key: string]: any}) => Node;

type Props = {
    parcel: Parcel,
    children: RenderFunction,
    pure?: boolean,
    forceUpdate?: any[],
    buffer?: boolean,
    debounce?: number,
    beforeChange?: ParcelValueUpdater|ParcelValueUpdater[],
    modifyBeforeUpdate?: ParcelValueUpdater|ParcelValueUpdater[]
};

export default function ParcelBoundary(props: Props): Node {
    let {
        parcel,
        children,
        pure = true,
        forceUpdate = [],
        buffer = false,
        debounce = 0,
        beforeChange = [],
        modifyBeforeUpdate = []
    } = props;

    // deprecation notice
    if(process.env.NODE_ENV !== 'production' && modifyBeforeUpdate.length > 0) {
        console.warn(`ParcelBoundary.modifyBeforeUpdate is deprecated. Please use ParcelBoundary.beforeChange instead`); /* eslint-disable-line no-console */
        beforeChange = beforeChange.concat(modifyBeforeUpdate);
    }

    let [innerParcel, parcelBufferControl] = useParcelBuffer({
        parcel,
        debounce,
        buffer,
        beforeChange
    });

    let renderChildren = () => children(innerParcel, parcelBufferControl);

    let memoed = useMemo(
        () => pure && renderChildren(),
        [innerParcel, ...forceUpdate]
    );

    return pure ? memoed : renderChildren();
}
