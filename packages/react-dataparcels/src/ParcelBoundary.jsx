// @flow
import React from 'react';
import type {Node} from 'react';
import Parcel from 'dataparcels';
import type {ChangeRequest} from 'dataparcels';

import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';
import shallowEquals from 'unmutable/lib/shallowEquals';

import set from 'unmutable/lib/set';
import pipe from 'unmutable/lib/util/pipe';

const log = (...args) => console.log(`ParcelBoundary:`, ...args); // eslint-disable-line

type Actions = {
    release: Function
};

type RenderFunction = (parcel: Parcel, actions: Actions, buffered: boolean) => Node;

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
    cachedChangeRequest: ?ChangeRequest,
    changeCount: number,
    makeBoundarySplit: Function,
    parcel: Parcel,
    parcelFromProps: Parcel
};

export default class ParcelBoundary extends React.Component<Props, State> { /* eslint-disable-line react/no-deprecated */

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

        let parcel = this.makeBoundarySplit(props.parcel);

        this.state = {
            cachedChangeRequest: undefined,
            changeCount: 0,
            makeBoundarySplit: this.makeBoundarySplit,
            parcel,
            parcelFromProps: parcel
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

        let parcelDataChanged: boolean = !ParcelBoundaryEquals(this.props.parcel, nextProps.parcel);

        if(!parcelDataChanged && (nextProps.debounce || nextProps.hold)) {
            parcelDataChanged = !ParcelBoundaryEquals(this.state.parcel, nextState.parcel);
        }

        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate)(nextProps.forceUpdate);
        let cachedChangeRequestChanged: boolean = this.state.cachedChangeRequest !== nextState.cachedChangeRequest;

        return parcelDataChanged || forceUpdateChanged || cachedChangeRequestChanged;
    }

    static getDerivedStateFromProps(props: Props, state: State): * {
        let {parcel} = props;
        let {
            makeBoundarySplit,
            parcelFromProps
        } = state;

        if(parcel !== parcelFromProps) {
            var newState: any = {
                parcelFromProps: parcel
            };

            if(!ParcelBoundaryEquals(parcelFromProps, parcel)) {
                if(props.debugParcel) {
                    log(`Parcel replaced from props:`);
                    parcel.toConsole();
                }

                newState.cachedChangeRequest = undefined;
                newState.changeCount = 0;
                newState.parcel = makeBoundarySplit(parcel);
            }

            return newState;
        }

        return null;
    }

    debugRenderStyle: Function = (): Object => {
        let rand = () => Math.floor((Math.random() * 0.75 + 0.25) * 256);
        return {
            backgroundColor: `rgb(${rand()},${rand()},${rand()})`,
            padding: "1rem",
            marginBottom: "1rem"
        };
    };

    addToBuffer: Function = (changeRequest: ChangeRequest) => (state: State): State => {
        let {debugBuffer} = this.props;
        let {
            cachedChangeRequest,
            changeCount
        } = state;

        if(debugBuffer) {
            log("Add to buffer:");
            changeRequest.toConsole();
        }

        let newCachedChangeRequest = cachedChangeRequest
            ? cachedChangeRequest.merge(changeRequest)
            : changeRequest;

        return {
            ...state,
            cachedChangeRequest: newCachedChangeRequest,
            changeCount: changeCount + 1
        };
    };

    cancelBuffer: Function = () => (state: State): State => {
        let {
            debugBuffer,
            debugParcel,
            parcel
        } = this.props;

        let {cachedChangeRequest} = state;

        if(debugBuffer) {
            log("Clear buffer:");
            cachedChangeRequest && cachedChangeRequest.toConsole();
        }
        if(!cachedChangeRequest) {
            return state;
        }

        if(debugParcel) {
            log(`Buffer cancelled. Parcel reverted:`);
            parcel.toConsole();
        }

        return {
            ...state,
            cachedChangeRequest: undefined,
            changeCount: 0,
            parcel: this.makeBoundarySplit(parcel)
        };
    };

    releaseBuffer: Function = () => (state: State): State => {
        let {debugBuffer} = this.props;
        let {cachedChangeRequest} = state;

        if(debugBuffer) {
            log("Release buffer:");
            cachedChangeRequest && cachedChangeRequest.toConsole();
        }

        if(!cachedChangeRequest) {
            return state;
        }

        this.props.parcel.dispatch(cachedChangeRequest);
        return {
            ...state,
            cachedChangeRequest: undefined,
            changeCount: 0
        };
    };

    makeBoundarySplit: Function = (parcel: Parcel): Parcel => {
        return parcel._boundarySplit({
            handleChange: (newParcel: Parcel, changeRequest: ChangeRequest) => {
                let {
                    debounce,
                    debugParcel,
                    hold
                } = this.props;

                let {changeCount} = this.state;

                if(debugParcel) {
                    log(`Parcel changed:`);
                    newParcel.toConsole();
                }

                let updateParcel = set('parcel', newParcel);
                let addToBuffer = this.addToBuffer(changeRequest);
                let releaseBuffer = this.releaseBuffer();

                if(!debounce && !hold) {
                    this.setState(pipe(
                        updateParcel,
                        addToBuffer,
                        releaseBuffer
                    ));
                    return;
                }

                if(hold) {
                    this.setState(pipe(
                        updateParcel,
                        addToBuffer
                    ));
                    return;
                }

                // debounce && !hold

                setTimeout(() => {
                    if(changeCount + 1 === this.state.changeCount) {
                        this.setState(releaseBuffer);
                    }
                }, debounce);

                this.setState(pipe(
                    updateParcel,
                    addToBuffer
                ));
            }
        });
    };

    render(): Node {
        let {children} = this.props;
        let {
            changeCount,
            parcel
        } = this.state;

        let actions = {
            cancel: () => this.setState(this.cancelBuffer()),
            release: () => this.setState(this.releaseBuffer())
        };
        let buffered = changeCount > 0;

        let element = children(parcel, actions, buffered);

        if(parcel._treeshare.debugRender) {
            return <div style={this.debugRenderStyle()}>{element}</div>;
        }
        return element;
    }
}
