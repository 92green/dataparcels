// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type ChangeRequest from 'dataparcels/ChangeRequest';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

const log = (...args) => console.log(`ParcelHoc:`, ...args); // eslint-disable-line

type Props = {};

type State = {
    parcel: ?Parcel,
    prevProps: {[key: string]: any},
    initialize: (props: Props) => Parcel
};

type ChildProps = {
    // ${name}: Parcel
};

type AnyProps = {
    [key: string]: any
};

type ValueFromProps = (props: AnyProps) => *;
type ShouldParcelUpdateFromProps = (prevProps: AnyProps, nextProps: AnyProps, valueFromProps: any) => boolean;
type OnChange = (parcel: Parcel, changeRequest: ChangeRequest) => void;

type ParcelHocConfig = {
    name: string,
    valueFromProps: ValueFromProps,
    shouldParcelUpdateFromProps?: ShouldParcelUpdateFromProps,
    onChange?: (props: AnyProps) => OnChange,
    delayUntil?: (props: AnyProps) => boolean,
    pipe?: (props: *) => (parcel: Parcel) => Parcel,
    debugParcel?: boolean
};

const PARCEL_HOC_NAME = `ParcelHoc()`;

export default (config: ParcelHocConfig): Function => {
    Types(`ParcelHoc()`, `config`, `object`)(config);

    let {
        name,
        valueFromProps,
        shouldParcelUpdateFromProps,
        onChange,
        delayUntil = (props) => true, /* eslint-disable-line no-unused-vars */
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        // debug options
        debugParcel = false
    } = config;

    Types(PARCEL_HOC_NAME, "config.name", "string")(name);
    Types(PARCEL_HOC_NAME, "config.valueFromProps", "function")(valueFromProps);
    onChange && Types(PARCEL_HOC_NAME, "config.onChange", "function")(onChange);
    shouldParcelUpdateFromProps && Types(PARCEL_HOC_NAME, "config.shouldParcelUpdateFromProps", "function")(shouldParcelUpdateFromProps);

    Types(PARCEL_HOC_NAME, "config.delayUntil", "function")(delayUntil);
    Types(PARCEL_HOC_NAME, "config.pipe", "function")(pipe);
    Types(PARCEL_HOC_NAME, "config.debugParcel", "boolean")(debugParcel);

    return (Component: ComponentType<ChildProps>) => class ParcelHoc extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);

            let initialize = (props: Props) => ParcelHoc.updateParcelValueFromProps(
                new Parcel({
                    value: valueFromProps(props),
                    handleChange: this.handleChange
                }),
                props
            );

            this.state = {
                parcel: undefined,
                prevProps: {},
                initialize
            };
        }

        static updateParcelValueFromProps(parcel: Parcel, props: Props): Parcel {
            return parcel._changeAndReturn((parcel: Parcel) => {
                let value: any = valueFromProps(props);
                return parcel.set(value);
            });
        }

        static getDerivedStateFromProps(props: Props, state: State): * {
            let {
                initialize,
                parcel,
                prevProps
            } = state;

            let newState = {};

            if(!parcel && delayUntil(props)) {
                newState.parcel = initialize(props);

                if(debugParcel) {
                    log(`Received initial value:`);
                    newState.parcel.toConsole();
                }
            }

            if(parcel && shouldParcelUpdateFromProps && shouldParcelUpdateFromProps(prevProps, props, valueFromProps) && parcel) {
                newState.parcel = ParcelHoc.updateParcelValueFromProps(parcel, props);

                if(debugParcel) {
                    log(`Parcel updated from props:`);
                    newState.parcel.toConsole();
                }
            }

            newState.prevProps = props;
            return newState;
        }

        handleChange = (parcel: Parcel, changeRequest: ChangeRequest) => {
            this.setState({parcel});
            if(debugParcel) {
                log(`Parcel changed:`);
                parcel.toConsole();
            }

            let callOnChange = (onChange: ?Function, value: *) => {
                if(!onChange) {
                    return;
                }
                let onChangeWithProps = onChange(this.props);
                Types(`handleChange()`, "return value of onChange", "function")(onChangeWithProps);
                onChangeWithProps(value, changeRequest);
            };

            if(changeRequest.hasValueChanged()) {
                callOnChange(onChange, parcel.value);
            }
        };

        render(): Node {
            let {parcel} = this.state;

            if(pipe && parcel) {
                let pipeWithProps = pipe(this.props);
                Types(`pipe()`, `return value of pipe`, `function`)(pipeWithProps);
                parcel = pipeWithProps(parcel);
                Types(`pipe()`, "return value of pipe(props)", `parcel`)(parcel);
            }

            let props = {
                ...this.props,
                [name]: parcel
            };

            return <Component {...props} />;
        }
    };
};
