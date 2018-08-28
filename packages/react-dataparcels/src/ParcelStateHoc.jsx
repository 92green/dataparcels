// @flow
import type {ComponentType} from 'react';
import type {Node} from 'react';
import type {ChangeRequest} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

type Props = {};
type State = {
    parcel: Parcel
};
type ChildProps = {};

type ValueCreator = (props: Object) => *;

type ParcelStateHocConfig = {
    debugRender?: boolean,
    initialValue?: ValueCreator,
    onChange: (props: Object) => (parcel: Parcel, changeRequest: ChangeRequest) => void,
    pipe?: (props: Object) => (parcel: Parcel) => Parcel,
    prop: string
};

export default (config: ParcelStateHocConfig): Function => {
    Types(`ParcelStateHoc() expects param "config" to be`, `object`)(config);

    let {
        initialValue = (props) => undefined, /* eslint-disable-line no-unused-vars */
        onChange = (props) => (value, changeRequest) => undefined, /* eslint-disable-line no-unused-vars */
        prop,
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        debugRender = false
    } = config;

    Types(`ParcelStateHoc() expects param "config.initialValue" to be`, `function`)(initialValue);
    Types(`ParcelStateHoc() expects param "config.onChange" to be`, `function`)(onChange);
    Types(`ParcelStateHoc() expects param "config.prop" to be`, `string`)(prop);
    Types(`ParcelStateHoc() expects param "config.pipe" to be`, `function`)(pipe);
    Types(`ParcelStateHoc() expects param "config.debugRender" to be`, `boolean`)(debugRender);

    return (Component: ComponentType<ChildProps>) => class ParcelStateHoc extends React.Component<Props, State> { /* eslint-disable-line */
        constructor(props: Props) {
            super(props);

            let parcel = new Parcel({
                value: initialValue(props),
                handleChange: this.handleChange,
                debugRender
            });

            this.state = {
                parcel
            };
        }

        handleChange = (parcel, changeRequest) => {
            this.setState({parcel});
            let onChangeWithProps = onChange(this.props);
            Types(`ParcelStateHoc() expects param "config.onChange" to return`, `function`)(onChangeWithProps);
            onChangeWithProps(parcel.value, changeRequest);
        };

        render(): Node {
            let {parcel} = this.state;
            if(pipe) {
                let pipeWithProps = pipe(this.props);
                Types(`ParcelStateHoc() expects param "config.pipe" to return`, `function`)(pipeWithProps);
                parcel = pipeWithProps(parcel);
                Types(`ParcelStateHoc() expects param "config.pipe(props)" to return`, `parcel`)(parcel);
            }

            let props = {
                ...this.props,
                [prop]: parcel
            };

            return <Component {...props} />;
        }
    };
};
