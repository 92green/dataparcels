// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

type Props = {};
type State = {
    parcel?: Parcel
};
type ChildProps = {};

type ValueCreator = (props: Object) => *;

type ParcelHocConfig = {
    name: string,
    initialValue?: ValueCreator,
    delayUntil?: (props: Object) => boolean,
    onChange?: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void,
    debugRender?: boolean,
    pipe?: (props: Object) => (parcel: Parcel) => Parcel
};

let ConfigParam = (value, name, verb = "be", type = "function") => Types(`ParcelHoc() expects param "config.${name}" to ${verb}`, type)(value);

export default (config: ParcelHocConfig): Function => {
    Types(`ParcelHoc() expects param "config" to be`, `object`)(config);

    let {
        name,
        initialValue = (props) => undefined, /* eslint-disable-line no-unused-vars */
        delayUntil = (props) => true, /* eslint-disable-line no-unused-vars */
        onChange = (props) => (value, changeRequest) => undefined, /* eslint-disable-line no-unused-vars */
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        debugRender = false
    } = config;

    ConfigParam(name, "name", "be", "string");
    ConfigParam(initialValue, "initialValue");
    ConfigParam(delayUntil, "delayUntil");
    ConfigParam(onChange, "onChange");
    ConfigParam(pipe, "pipe");
    ConfigParam(debugRender, "debugRender", "be", "boolean");

    return (Component: ComponentType<ChildProps>) => class ParcelHoc extends React.Component<Props, State> { /* eslint-disable-line */
        constructor(props: Props) {
            super(props);

            let parcel = delayUntil(props)
                ? this.initialize(props)
                : undefined;

            this.state = {
                parcel
            };
        }

        componentWillReceiveProps(nextProps: Props) {
            if(!this.state.parcel && delayUntil(nextProps)) {
                this.setState({
                    parcel: this.initialize(nextProps)
                });
            }
        }

        initialize = (props: Props) => new Parcel({
            value: initialValue(props),
            handleChange: this.handleChange,
            debugRender
        });

        handleChange = (parcel, changeRequest) => {
            this.setState({parcel});
            let onChangeWithProps = onChange(this.props);
            ConfigParam(onChangeWithProps, "onChange", "return");
            onChangeWithProps(parcel.value, changeRequest);
        };

        render(): Node {
            let {parcel} = this.state;

            if(pipe && parcel) {
                let pipeWithProps = pipe(this.props);
                ConfigParam(pipeWithProps, "pipe", "return");
                parcel = pipeWithProps(parcel);
                ConfigParam(parcel, "pipe(props)", "return", "parcel");
            }

            let props = {
                ...this.props,
                [name]: parcel
            };

            return <Component {...props} />;
        }
    };
};
