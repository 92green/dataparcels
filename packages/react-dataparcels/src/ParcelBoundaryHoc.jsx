// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type Parcel from 'dataparcels';
import type {ParcelValueUpdater} from 'dataparcels';
import type ParcelBufferControl from './ParcelBufferControl';

import React from 'react';
import ParcelBoundary from './ParcelBoundary';
import Types from 'dataparcels/lib/types/Types';

type Props = {
    // [config.name]?: Parcel
};
type ChildProps = {
    // [config.name]?: Parcel,
    // [config.name + "Control"]?: ParcelBufferControl
    // ...
};

type AnyProps = {
    [key: string]: any
};

type ParcelBoundaryHocConfig = {
    name: string|((props: AnyProps) => string),
    debounce?: number|(props: AnyProps) => number,
    hold?: boolean|(props: AnyProps) => boolean,
    modifyBeforeUpdate?: ParcelValueUpdater[]
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

            // function array config options
            let modifyBeforeUpdate: Array<ParcelValueUpdater> = config.modifyBeforeUpdate || [];

            // type check normal config options
            Types(PARCEL_BOUNDARY_HOC_NAME, "config.name", "string")(name);
            debounce && Types(PARCEL_BOUNDARY_HOC_NAME, "config.debounce", "number")(debounce);
            Types(PARCEL_BOUNDARY_HOC_NAME, "config.hold", "boolean")(hold);

            // type check function array config options
            let checkFunctionArray = (name: string, array: Array<*>) => array.forEach((fn, index) => Types(PARCEL_BOUNDARY_HOC_NAME, `config.${name}[${index}]`, "function")(fn));
            checkFunctionArray("modifyBeforeUpdate", modifyBeforeUpdate);

            let parcel = this.props[name];
            if(!parcel) {
                return <Component {...this.props} />;
            }

            Types(`ParcelBoundaryHoc()`, `prop "${name}"`, `parcel`)(parcel);

            return <ParcelBoundary
                parcel={parcel}
                debounce={debounce}
                hold={hold}
                modifyBeforeUpdate={modifyBeforeUpdate}
                pure={false}
            >
                {(innerParcel: Parcel, control: ParcelBufferControl): Node => {
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
