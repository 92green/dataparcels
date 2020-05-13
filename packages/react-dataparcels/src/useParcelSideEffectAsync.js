// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';

// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import Parcel from 'dataparcels';

type QueueItem = [Parcel, ChangeRequest];

const mergeQueue = (parcel: Parcel, queue: QueueItem[]): QueueItem[] => {
    if(queue.length < 2) {
        return queue;
    }

    let mergedChangeRequests = queue
        .map(([/*parcel*/, changeRequest]) => changeRequest)
        .reduce((prev, next) => prev.merge(next));

    let mergedQueueItem = parcel._changeAndReturn(
        newParcel => newParcel.dispatch(mergedChangeRequests)
    );

    return [mergedQueueItem];
};

type Params = {
    parcel: Parcel,
    onSideEffect: (parcel: Parcel, changeRequest: ChangeRequest) => Promise<any>,
    onSideEffectUseResult: boolean
};

type AsyncStatus = {
    status: string,
    isPending: boolean,
    isResolved: boolean,
    isRejected: boolean,
    error: string
};

type Return = [Parcel, AsyncStatus];

export default (params: Params): Return => {

    //
    // state
    //

    // outerParcel is locked to changes in props
    const [outerParcel, setOuterParcel] = useState(null);
    // innerParcel is a modified parcel derived from outerParcel
    const [innerParcel, setInnerParcel] = useState(null);

    //
    // queue
    //

    const queueRef = useRef([]);
    const statusRef = useRef('idle');
    const errorRef = useRef(undefined);

    //
    // async status
    //

    let getAsyncStatus = () => {
        let status = statusRef.current;
        let error = status === 'rejected' ? errorRef.current.error : undefined;

        return {
            status,
            isPending: status === 'pending',
            isResolved: status === 'resolved',
            isRejected: status === 'rejected',
            error
        };
    };

    // control contains the hooks control object
    const [asyncStatus, setAsyncStatus] = useState(getAsyncStatus);

    let updateAsyncStatus = () => setAsyncStatus(getAsyncStatus());

    //
    // queue processing
    //

    const processChangeDone = (onDispatch: Function) => (result: any) => {
        if(queueRef.current.length > 1) {
            processChange();
        } else {
            let [newParcel, changeRequest] = queueRef.current.shift();
            onDispatch(newParcel, changeRequest, result);
        }
        updateAsyncStatus();
    };

    const processChangeSuccess = processChangeDone((newParcel: Parcel, changeRequest: ChangeRequest, result: any) => {

        if(params.onSideEffect && params.onSideEffectUseResult) {
            let [/*parcel*/, changeRequestWithResult] = newParcel._changeAndReturn(
                newParcel => newParcel.set(result)
            );
            changeRequestWithResult._originId = changeRequest._originId;
            changeRequestWithResult._originPath = changeRequest._originPath;
            changeRequest = changeRequestWithResult;
        } else {
            // when onSideEffectUseResult is false, its necessary to rebase
            // so changes made after submit but before
            // processChangeSuccess() are not overwritten when the top
            // parcel finally updates
            changeRequest = changeRequest._create({
                nextFrameMeta: {
                    rebase: true
                }
            });
        }

        statusRef.current = 'resolved';
        params.parcel.dispatch(changeRequest);
    });

    const processChangeError = processChangeDone((newParcel: Parcel, changeRequest: ChangeRequest, error: any) => {
        changeRequest._revert();
        queueRef.current = [];
        errorRef.current = {error};
        statusRef.current = 'rejected';
    });

    const processChange = () => {

        // merge remaining changes in the queue together
        queueRef.current = mergeQueue(params.parcel, queueRef.current);
        statusRef.current = 'pending';
        updateAsyncStatus();
        params
            .onSideEffect(...queueRef.current[0])
            .then(processChangeSuccess, processChangeError);
    };

    //
    // update inner parcel when outer parcel changes (or is first set)
    //

    let newInnerParcel;
    if(params.parcel !== outerParcel) {

        let handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {

            // all changes go into the queue
            queueRef.current.push([newParcel, changeRequest]);

            // if nothing is pending, then call onSideEffect
            if(statusRef.current !== 'pending') {
                processChange();
            }
        };

        newInnerParcel = params.parcel._boundarySplit(handleChange);
        setOuterParcel(params.parcel);
        setInnerParcel(newInnerParcel);
    }

    let returnedParcel: Parcel = innerParcel || newInnerParcel;

    //
    // return
    //

    return [returnedParcel, asyncStatus];
};
