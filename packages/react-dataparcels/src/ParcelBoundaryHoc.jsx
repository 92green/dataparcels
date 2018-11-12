// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';
import ParcelBoundary from './ParcelBoundary';
import Types from 'dataparcels/lib/types/Types';

type Props = {
    // [config.name]?: Parcel
};
type ChildProps = {
    // [config.name]?: Parcel,
    // [config.name + "Actions"]?: Parcel,
    // [config.name + "Buffered"]?: Parcel,
    // [config.originalParcelProp]?: Parcel
    // ...
};

type ParcelBoundaryHocConfig = {
    name: string|((props: *) => string),
    debounce?: number|(props: *) => number,
    hold?: boolean|(props: *) => boolean,
    originalParcelProp?: string|(props: *) => string,
    debugBuffer?: boolean,
    debugParcel?: boolean
};

const PARCEL_BOUNDARY_HOC_NAME = `ParcelBoundaryHoc()`;

export default (config: ParcelBoundaryHocConfig): Function => {
    Types(`ParcelBoundaryHoc()`, `config`, `object`)(config);

    return (Component: ComponentType<ChildProps>) => class ParcelBoundaryHoc extends React.Component<Props> { /* eslint-disable-line */
        render(): Node {

            let fromProps = (value) => (typeof value === "function") ? value(this.props) : value;

            // $FlowFixMe - flow can'tm seem to understand that name will never be a boolean or number according to its own previous types
            let name: string = fromProps(config.name);
            // $FlowFixMe
            let debounce: ?number = fromProps(config.debounce) || undefined;
            // $FlowFixMe
            let hold: boolean = fromProps(config.hold) || false;
            // $FlowFixMe
            let originalParcelProp: ?string = fromProps(config.originalParcelProp);
            let debugBuffer: boolean = config.debugBuffer || false;
            let debugParcel: boolean = config.debugParcel || false;

            Types(PARCEL_BOUNDARY_HOC_NAME, "config.name", "string")(name);
            debounce && Types(PARCEL_BOUNDARY_HOC_NAME, "config.debounce", "number")(debounce);
            Types(PARCEL_BOUNDARY_HOC_NAME, "config.hold", "boolean")(hold);
            Types(PARCEL_BOUNDARY_HOC_NAME, "config.debugBuffer", "boolean")(debugBuffer);
            Types(PARCEL_BOUNDARY_HOC_NAME, "config.debugParcel", "boolean")(debugParcel);
            originalParcelProp && Types(PARCEL_BOUNDARY_HOC_NAME, "config.originalParcelProp", "string")(originalParcelProp);

            let parcel = this.props[name];
            if(!parcel) {
                return <Component {...this.props} />;
            }

            Types(`ParcelBoundaryHoc()`, `prop "${name}"`, `parcel`)(parcel);

            return <ParcelBoundary
                parcel={parcel}
                debounce={debounce}
                hold={hold}
                debugBuffer={debugBuffer}
                debugParcel={debugParcel}
                pure={false}
            >
                {(innerParcel, actions, buffered) => {
                    let childProps = {
                        ...this.props,
                        // $FlowFixMe - I want to use a computed property, flow
                        [name]: innerParcel,
                        // $FlowFixMe - I want to use a computed property, flow
                        [name + "Actions"]: actions,
                        // $FlowFixMe - I want to use a computed property, flow
                        [name + "Buffered"]: buffered
                    };

                    if(originalParcelProp) {
                        childProps[originalParcelProp] = parcel;
                    }

                    return <Component {...childProps} />;
                }}
            </ParcelBoundary>;
        }
    };
};
