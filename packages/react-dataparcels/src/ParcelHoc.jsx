// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

import flatMap from 'unmutable/lib/flatMap';
import filter from 'unmutable/lib/filter';
import get from 'unmutable/lib/get';
import isKeyed from 'unmutable/lib/isKeyed';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pick from 'unmutable/lib/pick';
import pipeWith from 'unmutable/lib/pipeWith';

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

type AnyProps = {
    [key: string]: any
};

type ValueFromProps = (props: AnyProps) => *;
type ShouldParcelUpdateFromProps = (prevValue: *, nextValue: *) => boolean;
type OnChange = (parcel: Parcel, changeRequest: ChangeRequest) => void;

type Partial = {
    valueFromProps?: ValueFromProps,
    shouldParcelUpdateFromProps?: ShouldParcelUpdateFromProps,
    onChange?: (props: AnyProps) => OnChange,
    keys: string[]
};

type ParcelHocConfig = {
    name: string,
    valueFromProps?: ValueFromProps,
    shouldParcelUpdateFromProps?: ShouldParcelUpdateFromProps,
    onChange?: (props: AnyProps) => OnChange,
    partials?: Array<Partial>,
    delayUntil?: (props: AnyProps) => boolean,
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
        shouldParcelUpdateFromProps,
        onChange,
        partials,
        delayUntil = (props) => true, /* eslint-disable-line no-unused-vars */
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        // debug options
        debugParcel = false,
        debugRender = false
    } = config;

    Types(PARCEL_HOC_NAME, "config.name", "string")(name);

    if(partials) {
        Types(PARCEL_HOC_NAME, "config.partials", "array")(partials);
        partials.forEach(({keys, valueFromProps, onChange, shouldParcelUpdateFromProps}) => {
            valueFromProps && Types(PARCEL_HOC_NAME, "config.partials[].valueFromProps", "function")(valueFromProps);
            onChange && Types(PARCEL_HOC_NAME, "config.partials[].onChange", "function")(onChange);
            shouldParcelUpdateFromProps && Types(PARCEL_HOC_NAME, "config.partials[].shouldParcelUpdateFromProps", "function")(shouldParcelUpdateFromProps);
            keys && Types(PARCEL_HOC_NAME, "config.partials[].keys", "array")(keys);
        });
    } else {
        Types(PARCEL_HOC_NAME, "config.valueFromProps", "function")(valueFromProps);
        onChange && Types(PARCEL_HOC_NAME, "config.onChange", "function")(onChange);
        shouldParcelUpdateFromProps && Types(PARCEL_HOC_NAME, "config.shouldParcelUpdateFromProps", "function")(shouldParcelUpdateFromProps);
    }

    Types(PARCEL_HOC_NAME, "config.delayUntil", "function")(delayUntil);
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
                let value;

                if(partials) {
                    let getKeys = get('keys');

                    let namedKeys = pipeWith(
                        partials,
                        filter(getKeys),
                        flatMap(getKeys)
                    );

                    value = pipeWith(
                        {},
                        // $FlowFixMe
                        ...partials.map((partial, index) => {
                            let partialValue = partial.valueFromProps(props);
                            let keys = getKeys(partial);
                            if(!isKeyed(partialValue)) {
                                throw new Error(`Result of partial[${index}].valueFromProps() should be object, but got ${partialValue}`);
                            }
                            return pipeWith(
                                partialValue,
                                keys ? pick(keys) : omit(namedKeys),
                                merge
                            );
                        })
                    );
                } else {
                    value = valueFromProps(props);
                }

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

        handleChange = (parcel: Parcel, changeRequest: ChangeRequest) => {
            this.setState({parcel});
            if(debugParcel) {
                log(`Parcel changed:`);
                parcel.toConsole();
            }

            if(onChange) {
                let onChangeWithProps = onChange(this.props);
                Types(`handleChange()`, "return value of onChange", "function")(onChangeWithProps);
                onChangeWithProps(parcel.value, changeRequest);
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
