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
type ParcelStateHocConfig = {
    debugRender?: boolean,
    initialValue?: (props: Object) => *,
    pipe?: (props: Object) => (parcel: Parcel) => Parcel,
    prop: string
};

export default (config: ParcelStateHocConfig): Function => {
    Types(`ParcelStateHoc() expects param "config" to be`, `object`)(config);

    let {
        initialValue = () => undefined,
        prop,
        pipe = props => ii => ii, /* eslint-disable-line no-unused-vars */
        debugRender = false
    } = config;

    Types(`ParcelStateHoc() expects param "config.initialValue" to be`, `function`)(initialValue);
    Types(`ParcelStateHoc() expects param "config.prop" to be`, `string`)(prop);
    Types(`ParcelStateHoc() expects param "config.pipe" to be`, `function`)(pipe);
    Types(`ParcelStateHoc() expects param "config.debugRender" to be`, `boolean`)(debugRender);

    return (Component: ComponentType<ChildProps>) => class ParcelStateHoc extends React.Component<Props, State> {
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
