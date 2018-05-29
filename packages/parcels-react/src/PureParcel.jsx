// @flow
import React from 'react';
import type {Node} from 'react';
import Parcel from 'parcels';

import shallowEquals from 'unmutable/lib/shallowEquals';

type RenderFunction = (parcel: Parcel) => Node;

type Props = {
    children: RenderFunction,
    debounce?: number,
    forceUpdate?: Array<*>,
    parcel: Parcel
};

type State = {
    parcel: Parcel
};

export default class PureParcel extends React.Component<Props, State> {

    changeCount: number = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            parcel: props.parcel
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        // BUG - meta object is blatting my stuff? Time to add tests...
        let withParcelValue = ({forceUpdate = []}, {parcel}) => ({
            ...parcel.data(),
            ...forceUpdate
        });

        let aa = withParcelValue(this.props, this.state);
        let bb = withParcelValue(nextProps, nextState);
        let shouldUpdate = !shallowEquals(aa)(bb);
        console.log(shouldUpdate, this.state.parcel.path(), this.state.parcel.raw());
        return shouldUpdate;
    }

    componentWillReceiveProps(nextProps: Props) {
        let aa = this.state.parcel.data();
        let bb = nextProps.parcel.data();

        if(!shallowEquals(aa)(bb)) {
            this.setState({
                parcel: nextProps.parcel
            });
        }
    }

    render(): Node {
        let {
            children
        } = this.props;

        let {parcel} = this.state;
        return children(parcel);
    }
}

/*

        if(debounce) {
            parcel = parcel.modifyChange(({parcel, continueChange}: Object) => {
                this.changeCount++;
                let initialChangeCount = this.changeCount;
                setTimeout(() => {
                    if(this.changeCount === initialChangeCount) {
                        continueChange();
                    }
                }, debounce);
            });
        }
*/
