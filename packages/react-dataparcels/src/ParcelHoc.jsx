// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

import defaults from 'unmutable/lib/defaults';
import flatMap from 'unmutable/lib/flatMap';
import filter from 'unmutable/lib/filter';
import get from 'unmutable/lib/get';
import isKeyed from 'unmutable/lib/isKeyed';
import keyArray from 'unmutable/lib/keyArray';
import merge from 'unmutable/lib/merge';
import omit from 'unmutable/lib/omit';
import pick from 'unmutable/lib/pick';
import pipeWith from 'unmutable/lib/pipeWith';

const log = (...args) => console.log(`ParcelHoc:`, ...args); // eslint-disable-line

type Props = {};
type State = {
    parcel: ?Parcel,
    initialize: (value: *) => Parcel,
    prevProps: {[key: string]: any}
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

type ParcelHocPartialConfig = {
    valueFromProps: ValueFromProps,
    shouldParcelUpdateFromProps?: ShouldParcelUpdateFromProps,
    onChange?: (props: AnyProps) => OnChange,
    keys?: string[]
};

type ParcelHocConfig = {
    name: string,
    valueFromProps: ValueFromProps,
    shouldParcelUpdateFromProps?: ShouldParcelUpdateFromProps,
    onChange?: (props: AnyProps) => OnChange,
    partials?: Array<ParcelHocPartialConfig>,
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
        valueFromProps,
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

    let namedPartialKeys = [];

    if(partials) {
        Types(PARCEL_HOC_NAME, "config.partials", "array")(partials);
        partials.forEach(({keys, valueFromProps, onChange, shouldParcelUpdateFromProps}) => {
            Types(PARCEL_HOC_NAME, "config.partials[].valueFromProps", "function")(valueFromProps);
            onChange && Types(PARCEL_HOC_NAME, "config.partials[].onChange", "function")(onChange);
            shouldParcelUpdateFromProps && Types(PARCEL_HOC_NAME, "config.partials[].shouldParcelUpdateFromProps", "function")(shouldParcelUpdateFromProps);
            keys && Types(PARCEL_HOC_NAME, "config.partials[].keys", "array")(keys);
        });

        let getKeys = get('keys');
        namedPartialKeys = pipeWith(
            partials,
            filter(getKeys),
            flatMap(getKeys)
        );
    } else {
        Types(PARCEL_HOC_NAME, "config.valueFromProps", "function")(valueFromProps);
        onChange && Types(PARCEL_HOC_NAME, "config.onChange", "function")(onChange);
        shouldParcelUpdateFromProps && Types(PARCEL_HOC_NAME, "config.shouldParcelUpdateFromProps", "function")(shouldParcelUpdateFromProps);
    }

    Types(PARCEL_HOC_NAME, "config.delayUntil", "function")(delayUntil);
    Types(PARCEL_HOC_NAME, "config.pipe", "function")(pipe);
    Types(PARCEL_HOC_NAME, "config.debugParcel", "boolean")(debugParcel);
    Types(PARCEL_HOC_NAME, "config.debugRender", "boolean")(debugRender);

    let partialPick = (keys) => keys
        ? pick(keys)
        : omit(namedPartialKeys);

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
                prevProps: {}
            };
        }

        static getPartialValueFromProps(props: Props) {
            return (partials: Array<ParcelHocPartialConfig>): * => pipeWith(
                {},
                ...partials.map(({valueFromProps, keys}, index) => {
                    let partialValue = valueFromProps(props);
                    if(!isKeyed(partialValue)) {
                        throw new Error(`Result of partial[${index}].valueFromProps() should be object, but got ${partialValue}`);
                    }
                    return pipeWith(
                        partialValue,
                        partialPick(keys),
                        merge
                    );
                })
            );
        }

        static getDerivedStateFromProps(props: Props, state: State): * {
            let {parcel} = state;
            let newState = {};
            let partialValueFromProps = ParcelHoc.getPartialValueFromProps(props);

            if(!parcel && delayUntil(props)) {
                let value = partials
                    ? partialValueFromProps(partials)
                    : valueFromProps(props);

                newState.parcel = state.initialize(value);

                if(debugParcel) {
                    log(`Received initial value:`);
                    newState.parcel.toConsole();
                }
            }

            let newValueFromProps;
            if(parcel) {
                if(partials) {
                    let partialsToUpdate = partials.filter(({shouldParcelUpdateFromProps, valueFromProps}) => {
                        return shouldParcelUpdateFromProps && shouldParcelUpdateFromProps(state.prevProps, props, valueFromProps);
                    });

                    if(partialsToUpdate.length > 0) {
                        newValueFromProps = pipeWith(
                            partialsToUpdate,
                            partialValueFromProps,
                            defaults(parcel.value)
                        );
                    }

                } else if(shouldParcelUpdateFromProps && shouldParcelUpdateFromProps(state.prevProps, props, valueFromProps)) {
                    newValueFromProps = valueFromProps(props);
                }

                if(newValueFromProps) {
                    // $FlowFixMe - parcel cant possibly be undefined here
                    newState.parcel = parcel.batchAndReturn((parcel: Parcel) => {
                        parcel.set(newValueFromProps);
                    });

                    if(debugParcel) {
                        log(`Parcel updated from props:`);
                        newState.parcel.toConsole();
                    }
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

            let callOnChange = (onChange, value) => {
                if(!onChange) {
                    return;
                }
                let onChangeWithProps = onChange(this.props);
                Types(`handleChange()`, "return value of onChange", "function")(onChangeWithProps);
                onChangeWithProps(value, changeRequest);
            };

            if(partials) {
                partials.forEach(({keys, onChange}) => {
                    let partialValue = partialPick(keys)(parcel.value);
                    if(!keys) {
                        // get all unnamed keys from previous and next data, to see if any have changed
                        keys = pipeWith(
                            changeRequest.nextData.value,
                            merge(changeRequest.prevData.value),
                            omit(namedPartialKeys),
                            keyArray()
                        );
                    }
                    if(keys.some(key => changeRequest.hasValueChanged([key]))) {
                        callOnChange(onChange, partialValue);
                    }
                });
            } else if(changeRequest.hasValueChanged()) {
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
