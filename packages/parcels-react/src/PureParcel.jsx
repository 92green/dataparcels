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
        let parcelDataChanged: boolean = nextProps.debounce
            ? !this.state.parcel.equals(nextState.parcel)
            : !this.props.parcel.equals(nextProps.parcel);

        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate || [])(nextProps.forceUpdate || []);
        return parcelDataChanged || forceUpdateChanged;
    }

    componentWillReceiveProps(nextProps: Object) {
        let {parcel} = nextProps;
        if(!this.props.parcel.equals(parcel)) {
            this.setState({
                parcel
            });
        }
    }

    debugRenderStyle: Function = (): Object => {
        let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
        return {
            backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
            padding: "1rem",
            marginBottom: "1rem"
        };
    };

    getParcel: Function = (): Parcel => {
        let {
            debounce = 0
        } = this.props;

        if(!debounce) {
            return this.props.parcel;
        }

        return this.state.parcel
            .modifyChange(({parcel, continueChange, newParcelData}: Object) => {
                let parcelData = newParcelData();
                this.setState({
                    parcel: parcel._create({
                        parcelData
                    })
                });

                this.changeCount++;
                let originalChangeCount = this.changeCount;
                setTimeout(() => {
                    if(originalChangeCount === this.changeCount) {
                        continueChange();
                    }
                }, debounce);
            });
    };

    render(): Node {
        let {children} = this.props;
        let parcel = this.getParcel();
        let element = children(parcel);

        if(parcel._treeshare.getDebugRender()) {
            return <div style={this.debugRenderStyle()}>{element}</div>;
        }
        return element;
    }
}
