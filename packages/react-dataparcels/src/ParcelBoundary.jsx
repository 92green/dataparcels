// @flow
import React from 'react';
import type {Node} from 'react';
import Parcel from 'dataparcels';
import type {ChangeRequest} from 'dataparcels';

import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';
import shallowEquals from 'unmutable/lib/shallowEquals';

const log = (...args) => console.log(`ParcelBoundary:`, ...args);

type Actions = {
    release: Function
};

type RenderFunction = (parcel: Parcel, actions: Actions) => Node;

type Props = {
    children: RenderFunction,
    debounce: number,
    debugBuffer: boolean,
    debugParcel: boolean,
    hold: boolean,
    forceUpdate: Array<*>,
    parcel: Parcel,
    pure: boolean
};

type State = {
    parcel: Parcel
};

export default class ParcelBoundary extends React.Component<Props, State> { /* eslint-disable-line react/no-deprecated */

    cachedChangeRequest: ?ChangeRequest;
    changeCount: number = 0;

    static defaultProps: * = {
        debounce: 0,
        debugBuffer: false,
        debugParcel: false,
        hold: false,
        forceUpdate: [],
        pure: true
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            parcel: this.makeBoundarySplit(props.parcel)
        };

        if(props.debugParcel) {
            log(`Received initial value`);
            props.parcel.toConsole();
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        if(!nextProps.pure) {
            return true;
        }

        let parcelDataChanged: boolean = (nextProps.debounce || nextProps.hold)
            ? !ParcelBoundaryEquals(this.state.parcel, nextState.parcel)
            : !ParcelBoundaryEquals(this.props.parcel, nextProps.parcel);

        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate)(nextProps.forceUpdate);
        return parcelDataChanged || forceUpdateChanged;
    }

    componentWillReceiveProps(nextProps: Object) {
        let {parcel} = nextProps;
        if(!ParcelBoundaryEquals(this.props.parcel, parcel)) {
            this.cachedChangeRequest = undefined;
            this.setState({
                parcel: this.makeBoundarySplit(parcel)
            });

            if(nextProps.debugParcel) {
                log(`Parcel replaced from props:`);
                parcel.toConsole();
            }
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

    addToBuffer: Function = (changeRequest: ChangeRequest) => {
        let {debugBuffer} = this.props;
        if(debugBuffer) {
            console.log("ParcelBoundary: Add to buffer:");
            changeRequest.toConsole();
        }
        if(!this.cachedChangeRequest) {
            this.cachedChangeRequest = changeRequest;
        } else {
            this.cachedChangeRequest = this.cachedChangeRequest.merge(changeRequest);
        }
        this.changeCount++;
    };

    cancelBuffer: Function = () => {
        let {
            debugBuffer,
            debugParcel,
            parcel
        } = this.props;

        if(debugBuffer) {
            console.log("ParcelBoundary: Clear buffer:");
            this.cachedChangeRequest && this.cachedChangeRequest.toConsole();
        }
        if(!this.cachedChangeRequest) {
            return;
        }
        this.cachedChangeRequest = undefined;
        this.setState({
            parcel: this.makeBoundarySplit(parcel)
        });

        if(debugParcel) {
            log(`Buffer cancelled. Parcel reverted:`);
            parcel.toConsole();
        }
    };

    releaseBuffer: Function = () => {
        let {debugBuffer} = this.props;
        if(debugBuffer) {
            console.log("ParcelBoundary: Release buffer:");
            this.cachedChangeRequest && this.cachedChangeRequest.toConsole();
        }
        if(!this.cachedChangeRequest) {
            return;
        }
        this.props.parcel.dispatch(this.cachedChangeRequest);
        this.cachedChangeRequest = undefined;
    };

    makeBoundarySplit: Function = (parcel: Parcel): Parcel => {
        let {debugParcel} = this.props;
        return parcel._boundarySplit({
            handleChange: (newParcel: Parcel, changeRequest: ChangeRequest) => {
                let {
                    debounce,
                    hold
                } = this.props;

                this.setState({
                    parcel: newParcel
                });

                if(debugParcel) {
                    log(`Parcel changed:`);
                    newParcel.toConsole();
                }

                this.addToBuffer(changeRequest);

                let shouldBeSynchronous = () => changeRequest
                    .actions()
                    .some(action => action.shouldBeSynchronous());

                if((!debounce && !hold) || shouldBeSynchronous()) {
                    this.releaseBuffer();
                    return;
                }

                if(hold) {
                    return;
                }

                // debounce && !hold

                let originalChangeCount = this.changeCount;
                setTimeout(() => {
                    if(originalChangeCount === this.changeCount) {
                        this.releaseBuffer();
                    }
                }, debounce);
            }
        });
    };

    render(): Node {
        let {children} = this.props;
        let {parcel} = this.state;
        let actions = {
            cancel: this.cancelBuffer,
            release: this.releaseBuffer
        };

        let element = children(parcel, actions);

        if(parcel._treeshare.debugRender) {
            return <div style={this.debugRenderStyle()}>{element}</div>;
        }
        return element;
    }
}
