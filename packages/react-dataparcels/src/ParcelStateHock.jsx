// @flow
import React from 'react';
import type {ComponentType, Node} from 'react';
import Parcel from 'dataparcels';
import Types from 'dataparcels/lib/types/Types';

type Props = {};
type State = {
    parcel: Parcel
};
type ChildProps = {};
type ParcelStateHockConfig = {
    debugRender?: boolean,
    initialValue?: (props: Object) => *,
    modify?: (props: Object) => (parcel: Parcel) => Parcel,
    prop: string
};

export default (config: ParcelStateHockConfig): Function => {
    Types(`ParcelStateHock() expects param "config" to be`, `object`)(config);

    let {
        initialValue = () => undefined,
        prop,
        modify = props => ii => ii, /* eslint-disable-line no-unused-vars */
        debugRender = false
    } = config;

    Types(`ParcelStateHock() expects param "config.initialValue" to be`, `function`)(initialValue);
    Types(`ParcelStateHock() expects param "config.prop" to be`, `string`)(prop);
    Types(`ParcelStateHock() expects param "config.modify" to be`, `function`)(modify);
    Types(`ParcelStateHock() expects param "config.debugRender" to be`, `boolean`)(debugRender);

    return (Component: ComponentType<ChildProps>) => class ParcelStateHock extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);

            let parcel = new Parcel({
                // $FlowFixMe - props is not an unused function argument - this is only true for the default initialValue
                value: initialValue(props),
                handleChange: (parcel) => this.setState({parcel}),
                debugRender
            });

            this.state = {
                parcel
            };
        }

        render(): Node {
            let {parcel} = this.state;
            if(modify) {
                let modifyWithProps = modify(this.props);
                Types(`ParcelStateHock() expects param "config.modify" to return`, `function`)(modifyWithProps);
                parcel = modifyWithProps(parcel);
                Types(`ParcelStateHock() expects param "config.modify(props)" to return`, `parcel`)(parcel);
            }

            let props = {
                ...this.props,
                [prop]: parcel
            };

            return <Component {...props} />;
        }
    };
};
