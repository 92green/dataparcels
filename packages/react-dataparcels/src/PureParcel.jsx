// @flow
import React from 'react';
import type {Node} from 'react';
import Parcel from 'dataparcels';
import type {ChangeRequest} from 'dataparcels';

import PureParcelEquals from './util/PureParcelEquals';
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

export default class PureParcel extends React.Component<Props, State> { /* eslint-disable-line react/no-deprecated */

    changeCount: number = 0;

    constructor(props: Props) {
        super(props);
        this.state = {
            parcel: props.parcel
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        let parcelDataChanged: boolean = nextProps.debounce
            ? !PureParcelEquals(this.state.parcel, nextState.parcel)
            : !PureParcelEquals(this.props.parcel, nextProps.parcel);

        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate || [])(nextProps.forceUpdate || []);
        return parcelDataChanged || forceUpdateChanged;
    }

    componentWillReceiveProps(nextProps: Object) {
        let {parcel} = nextProps;
        if(!PureParcelEquals(this.props.parcel, parcel)) {
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
            .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {

                this.setState({
                    parcel: parcel._create({
                        parcelData: changeRequest.data
                    })
                });

                let shouldBeSynchronous: boolean = changeRequest
                    .actions()
                    .some(action => action.shouldBeSynchronous());

                this.changeCount++;
                let originalChangeCount = this.changeCount;
                if(shouldBeSynchronous) {
                    parcel.dispatch(changeRequest);
                    return;
                }

                setTimeout(() => {
                    if(originalChangeCount === this.changeCount) {
                        parcel.dispatch(changeRequest);
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
