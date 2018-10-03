// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';

import React from 'react';
import ParcelBoundary from './ParcelBoundary';
import Types from 'dataparcels/lib/types/Types';

type Props = {};
type State = {};
type ChildProps = {};

type ParcelBoundaryHocConfig = {
    name: string,
    debounce?: number,
    pure?: boolean,
    forceUpdate: *[],
    hold?: boolean,
    debugBuffer?: boolean,
    originalParcelProp?: string,
    actionsProp?: string
};

let ConfigParam = (value, name, type = "function") => Types(`ParcelBoundaryHoc() expects param "config.${name}" to be`, type)(value);

export default (config: ParcelBoundaryHocConfig): Function => {
    Types(`ParcelBoundaryHoc() expects param "config" to be`, `object`)(config);

    let {
        name,
        debounce,
        pure = false,
        forceUpdate,
        hold,
        debugBuffer,
        originalParcelProp,
        actionsProp = "actions"
    } = config;

    ConfigParam(name, "name", "string");
    ConfigParam(debounce, "initialValue", "boolean");
    ConfigParam(pure, "pure", "boolean");
    ConfigParam(pure, "hold", "boolean");
    ConfigParam(pure, "debugBuffer", "boolean");
    originalParcelProp && ConfigParam(originalParcelProp, "originalParcelProp", "string");
    ConfigParam(actionsProp, "actionsProp", "string");

    return (Component: ComponentType<ChildProps>) => class ParcelBoundaryHoc extends React.Component<Props, State> { /* eslint-disable-line */
        render(): Node {
            let parcel = this.props[name];
            Types(`ParcelBoundaryHoc() expects prop "${name}" to be`, `parcel`)(parcel);

            return <ParcelBoundary
                parcel={parcel}
                debounce={debounce}
                pure={pure}
                forceUpdate={forceUpdate}
                hold={hold}
                debugBuffer={debugBuffer}
            >
                {(innerParcel, actions) => {
                    let childProps = {
                        ...this.props,
                        [actionsProp]: actions,
                        [name]: innerParcel
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
