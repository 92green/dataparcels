// @flow
import type {Node} from 'react';
import type ChangeRequest from 'dataparcels/ChangeRequest';
import type {ParcelValueUpdater} from 'dataparcels';

import React from 'react';
import Parcel from 'dataparcels';

import ParcelBoundaryControl from './ParcelBoundaryControl';
import ApplyModifyBeforeUpdate from './util/ApplyModifyBeforeUpdate';
import ParcelBoundaryEquals from './util/ParcelBoundaryEquals';

import set from 'unmutable/lib/set';
import pipe from 'unmutable/lib/util/pipe';
import shallowEquals from 'unmutable/lib/shallowEquals';

type RenderFunction = (parcel: Parcel, control: ParcelBoundaryControl) => Node;

type Props = {
    children: RenderFunction,
    debounce: number,
    debugBuffer: boolean,
    debugParcel: boolean,
    hold: boolean,
    forceUpdate: Array<*>,
    modifyBeforeUpdate: Array<ParcelValueUpdater>,
    onCancel: Array<(continueCancel: Function) => void>,
    onRelease: Array<(continueRelease: Function) => void>,
    parcel: Parcel,
    pure: boolean,
    keepState: boolean
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
        modifyBeforeUpdate: [],
        onCancel: [],
        onRelease: [],
        pure: true,
        keepState: false
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

        if(process.env.NODE_ENV !== 'production' && props.debugParcel) {
            console.log(`ParcelBoundary: Received initial value:`); // eslint-disable-line
            console.log(props.parcel.data); // eslint-disable-line
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        if(!nextProps.pure) {
            return true;
        }

        let parcelDataChanged: boolean = !ParcelBoundaryEquals(this.props.parcel, nextProps.parcel);

        if(!parcelDataChanged) {
            parcelDataChanged = !ParcelBoundaryEquals(this.state.parcel, nextState.parcel);
        }

        let forceUpdateChanged: boolean = !shallowEquals(this.props.forceUpdate)(nextProps.forceUpdate);
        let cachedChangeRequestChanged: boolean = this.state.cachedChangeRequest !== nextState.cachedChangeRequest;

        return parcelDataChanged || forceUpdateChanged || cachedChangeRequestChanged;
    }

    static getDerivedStateFromProps(props: Props, state: State): * {
        let {
            parcel,
            keepState,
            modifyBeforeUpdate
        } = props;

        let {
            makeBoundarySplit,
            parcelFromProps,
            parcel: parcelFromState
        } = state;

        let updateState = parcel !== parcelFromProps;

        if(keepState && parcel._lastOriginId.startsWith(parcel.id)) {
            // if keepState, don't update state if the last change came from within this parcel boundary
            updateState = false;
        }

        if(updateState) {
            var newState: any = {
                parcelFromProps: parcel
            };

            if(!ParcelBoundaryEquals(parcelFromProps, parcel)) {
                if(process.env.NODE_ENV !== 'production' && props.debugParcel) {
                    console.log(`ParcelBoundary: Parcel replaced from props:`); // eslint-disable-line
                    console.log(parcel.data); // eslint-disable-line
                }

                let injectPreviousData = () => parcelFromState.data;
                injectPreviousData._isParcelUpdater = true;

                newState.cachedChangeRequest = undefined;
                newState.changeCount = 0;
                newState.parcel = makeBoundarySplit(parcel)
                    ._changeAndReturn((parcel: Parcel) => parcel
                        .modifyDown(injectPreviousData)
                        .pipe(ApplyModifyBeforeUpdate(modifyBeforeUpdate))
                        ._setData(parcel.data)
                    );
            }

            return newState;
        }

        return null;
    }

    addToBuffer: Function = (changeRequest: ChangeRequest) => (state: State): State => {
        let {debugBuffer} = this.props;
        let {
            cachedChangeRequest,
            changeCount
        } = state;

        if(process.env.NODE_ENV !== 'production' && debugBuffer) {
            console.log(`ParcelBoundary: Add to buffer:`); // eslint-disable-line
            console.log(changeRequest.toJS()); // eslint-disable-line
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

        if(process.env.NODE_ENV !== 'production' && debugBuffer) {
            console.log(`ParcelBoundary: Clear buffer:`); // eslint-disable-line
            cachedChangeRequest && console.log(cachedChangeRequest.toJS()); // eslint-disable-line
        }
        if(!cachedChangeRequest) {
            return state;
        }

        if(process.env.NODE_ENV !== 'production' && debugParcel) {
            console.log(`ParcelBoundary: Buffer cancelled. Parcel reverted:`); // eslint-disable-line
            console.log(parcel.data); // eslint-disable-line
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

        if(process.env.NODE_ENV !== 'production' && debugBuffer) {
            console.log(`ParcelBoundary: Release buffer:`); // eslint-disable-line
            cachedChangeRequest && console.log(cachedChangeRequest.toJS()); // eslint-disable-line
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
                    hold,
                    keepState
                } = this.props;

                let {changeCount} = this.state;

                if(process.env.NODE_ENV !== 'production' && debugParcel) {
                    console.log(`ParcelBoundary: Parcel changed:`); // eslint-disable-line
                    console.log(newParcel.data); // eslint-disable-line
                }

                let updateParcel = set('parcel', newParcel);
                let addToBuffer = this.addToBuffer(changeRequest);
                let releaseBuffer = this.releaseBuffer();

                if(!debounce && !hold) {
                    this.setState(pipe(
                        keepState ? updateParcel : ii => ii,
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
        let {
            children,
            modifyBeforeUpdate,
            onCancel,
            onRelease
        } = this.props;

        let {
            cachedChangeRequest,
            parcel
        } = this.state;

        let actions = cachedChangeRequest
            ? cachedChangeRequest.actions
            : [];

        let handleCancel = () => this.setState(this.cancelBuffer());
        let handleRelease = () => this.setState(this.releaseBuffer());

        let chain = (callbackArray, finalCallback) => callbackArray.reduceRight(
            (continueChain, callback) => () => callback(continueChain),
            finalCallback
        );

        return children(
            ApplyModifyBeforeUpdate(modifyBeforeUpdate)(parcel),
            new ParcelBoundaryControl({
                cancel: chain(onCancel, handleCancel),
                release: chain(onRelease, handleRelease),
                buffered: actions.length > 0,
                buffer: actions,
                originalParcel: this.props.parcel
            })
        );
    }
}
