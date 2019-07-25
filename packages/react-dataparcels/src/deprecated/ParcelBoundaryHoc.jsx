// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';
import type {ContinueChainFunction} from 'dataparcels';
import type {ParcelValueUpdater} from 'dataparcels';
import type ParcelBoundaryControl from './ParcelBoundaryControlDeprecated';

import React from 'react';
import ParcelBoundary from './ParcelBoundaryDeprecated';

type Props = {
    // [config.name]?: Parcel
};
type ChildProps = {
    // [config.name]?: Parcel,
    // [config.name + "Control"]?: ParcelBoundaryControl
    // ...
};

type AnyProps = {
    [key: string]: any
};

type ParcelBoundaryHocConfig = {
    name: string|((props: AnyProps) => string),
    debounce?: number|(props: AnyProps) => number,
    hold?: boolean|(props: AnyProps) => boolean,
    modifyBeforeUpdate?: Array<ParcelValueUpdater>,
    onCancel?: Array<ContinueChainFunction>,
    onRelease?: Array<ContinueChainFunction>,
    debugBuffer?: boolean,
    debugParcel?: boolean
};

export default (config: ParcelBoundaryHocConfig): Function => {

    // deprecation notice
    if(process.env.NODE_ENV !== 'production') {
        console.warn(`ParcelBoundaryHoc is deprecated. Please use the useParcelBuffer hook instead.`); /* eslint-disable-line no-console */
    }

    return (Component: ComponentType<ChildProps>) => class ParcelBoundaryHoc extends React.Component<Props> { /* eslint-disable-line */
        render(): Node {

            let fromProps = (value) => (typeof value === "function") ? value(this.props) : value;

            // $FlowFixMe - flow can'tm seem to understand that name will never be a boolean or number according to its own previous types
            let name: string = fromProps(config.name);
            // $FlowFixMe
            let debounce: ?number = fromProps(config.debounce) || undefined;
            // $FlowFixMe
            let hold: boolean = fromProps(config.hold) || false;

            // function array config options
            let modifyBeforeUpdate: Array<ParcelValueUpdater> = config.modifyBeforeUpdate || [];
            let onCancel: Array<ContinueChainFunction> = config.onCancel || [];
            let onRelease: Array<ContinueChainFunction> = config.onRelease || [];

            // debug config options
            let debugBuffer: boolean = config.debugBuffer || false;
            let debugParcel: boolean = config.debugParcel || false;

            let parcel = this.props[name];
            if(!parcel) {
                return <Component {...this.props} />;
            }

            return <ParcelBoundary
                parcel={parcel}
                debounce={debounce}
                hold={hold}
                debugBuffer={debugBuffer}
                debugParcel={debugParcel}
                modifyBeforeUpdate={modifyBeforeUpdate}
                onCancel={onCancel}
                onRelease={onRelease}
                pure={false}
            >
                {(innerParcel: Parcel, control: ParcelBoundaryControl): Node => {
                    let childProps = {
                        ...this.props,
                        // $FlowFixMe - I want to use a computed property, flow
                        [name]: innerParcel,
                        // $FlowFixMe - I want to use a computed property, flow
                        [name + "Control"]: control
                    };

                    return <Component {...childProps} />;
                }}
            </ParcelBoundary>;
        }
    };
};
