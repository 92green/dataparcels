// @flow
import React from 'react';
import type {ComponentType, Node} from 'react';
import Parcel from 'parcels';

type Props = {};
type State = {
    parcel: Parcel
};
type ChildProps = {};
type ParcelStateHockConfig = {
    initialValue?: (props: Object) => *,
    prop?: string
};

export default (config: ParcelStateHockConfig): Function => {
    let {
        initialValue = () => undefined,
        prop = "parcel"
    } = config;

    return (Component: ComponentType<ChildProps>) => class ParcelStateHock extends React.Component<Props, State> {
        constructor(props: Props) {
            super(props);

            let parcel = new Parcel({
                // $FlowFixMe - props is not an unused function argument - this is only true for the default initialValue
                value: initialValue(props),
                handleChange: (parcel) => this.setState({parcel})
            });

            this.state = {
                parcel
            };
        }

        render(): Node {
            let props = {
                ...this.props,
                [prop]: this.state.parcel
            };
            return <Component {...props} />;
        }
    };
};
