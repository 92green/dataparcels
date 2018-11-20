// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

const log = (...args) => console.log(`ParcelHoc:`, ...args); // eslint-disable-line

type Props = {};
type State = {
    parcel: ?Parcel,
    initialize: (value: *) => Parcel,
    prevValueFromProps: *
};
type ChildProps = {
    // ${name}: Parcel
};

type ParcelHocConfig = {
    name: string,
    valueFromProps?: (props: *) => *,
    shouldParcelUpdateFromProps?: (prevValue: *, nextValue: *) => boolean,
    delayUntil?: (props: *) => boolean,
    onChange?: (props: *) => (parcel: Parcel, changeRequest: ChangeRequest) => void,
    pipe?: (props: *) => (parcel: Parcel) => Parcel,
    debugParcel?: boolean,
    debugRender?: boolean
};

const PARCEL_HOC_NAME = `ParcelHoc()`;

export default (config: ParcelHocConfig): Function => {
    Types(`ParcelHoc()`, `config`, `object`)(config);

    let {
        name,
        valueFromProps = (props) => undefined, /* eslint-disable-line no-unused-vars */
        shouldParcelUpdateFromProps, /* eslint-disable-line no-unused-vars */
        delayUntil = (props) => true, /* eslint-disable-line no-unused-vars */
        onChange = (props) => (value, changeRequest) => undefined, /* eslint-disable-line no-unused-vars */
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        // debug options
        debugParcel = false,
        debugRender = false
    } = config;

    Types(PARCEL_HOC_NAME, "config.name", "string")(name);
    Types(PARCEL_HOC_NAME, "config.valueFromProps", "function")(valueFromProps);
    Types(PARCEL_HOC_NAME, "config.delayUntil", "function")(delayUntil);
    Types(PARCEL_HOC_NAME, "config.onChange", "function")(onChange);
    Types(PARCEL_HOC_NAME, "config.pipe", "function")(pipe);
    Types(PARCEL_HOC_NAME, "config.debugParcel", "boolean")(debugParcel);
    Types(PARCEL_HOC_NAME, "config.debugRender", "boolean")(debugRender);

    return (Component: ComponentType<ChildProps>) => class ParcelHoc extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);

            let initialize = (value: *) => new Parcel({
                value,
                handleChange: this.handleChange,
                debugRender
            });

            this.state = {
                parcel: undefined,
                initialize,
                prevValueFromProps: undefined
            };
        }

        static getDerivedStateFromProps(props: Props, state: State): * {
            let {parcel} = state;
            let newState = {};

            if(!parcel && delayUntil(props)) {
                let value = valueFromProps(props);
                newState.prevValueFromProps = value;
                newState.parcel = state.initialize(value);

                if(debugParcel) {
                    log(`Received initial value:`);
                    newState.parcel.toConsole();
                }
            }

            if(parcel && shouldParcelUpdateFromProps) {
                let value = valueFromProps(props);
                newState.prevValueFromProps = value;

                if(shouldParcelUpdateFromProps(state.prevValueFromProps, value)) {
                    newState.parcel = parcel.batchAndReturn((parcel: Parcel) => {
                        parcel.set(value);
                    });

                    if(debugParcel) {
                        log(`Parcel updated from props:`);
                        newState.parcel.toConsole();
                    }
                }
            }

            return newState;
        }

        handleChange = (parcel, changeRequest) => {
            this.setState({parcel});
            if(debugParcel) {
                log(`Parcel changed:`);
                parcel.toConsole();
            }

            let onChangeWithProps = onChange(this.props);
            Types(`handleChange()`, "return value of onChange", "function")(onChangeWithProps);
            onChangeWithProps(parcel.value, changeRequest);
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
