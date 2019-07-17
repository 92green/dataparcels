// @flow

import type ChangeRequest from 'dataparcels/ChangeRequest';

// $FlowFixMe - useState is a named export of react
import {useRef} from 'react';
// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

import isPromise from 'is-promise';
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
    onSubmit?: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onSubmitUseResult?: boolean
};

type Return = [Parcel, {[key: string]: any}];

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
    // submit status
    //

    let getSubmitStatus = () => {
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
    const [submitStatus, setSubmitStatus] = useState(getSubmitStatus);

    let updateSubmitStatus = () => setSubmitStatus(getSubmitStatus());

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
        updateSubmitStatus();
    };

    const processChangeSuccess = processChangeDone((newParcel: Parcel, changeRequest: ChangeRequest, result: any) => {

        if(params.onSubmit && params.onSubmitUseResult) {
            let [/*parcel*/, changeRequestWithResult] = newParcel._changeAndReturn(
                newParcel => newParcel.set(result)
            );
            changeRequestWithResult._originId = changeRequest._originId;
            changeRequestWithResult._originPath = changeRequest._originPath;
            changeRequest = changeRequestWithResult;
        } else {
            // when onSubmitUseResult is false, its necessary to rebase
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
        let {onSubmit} = params;

        // if no onSubmit is present, success! skip to the end
        if(!onSubmit) {
            processChangeSuccess();
            return;
        }

        // merge remaining changes in the queue together
        queueRef.current = mergeQueue(params.parcel, queueRef.current);
        let result = onSubmit(...queueRef.current[0]);

        // if a promise isn't returned, success! skip to the end
        if(!isPromise(result)) {
            processChangeSuccess(result);
            return;
        }

        statusRef.current = 'pending';
        updateSubmitStatus();

        // $FlowFixMe - flow can't tell that isPromise() guarantees
        // that this is a promise
        result.then(processChangeSuccess, processChangeError);
    };

    //
    // update inner parcel when outer parcel changes (or is first set)
    //

    let newInnerParcel;
    if(params.parcel !== outerParcel) {

        let handleChange = (newParcel: Parcel, changeRequest: ChangeRequest) => {

            // all changes go into the queue
            queueRef.current.push([newParcel, changeRequest]);

            // if nothing is pending, then call onSubmit
            if(statusRef.current !== 'pending') {
                processChange();
            }
        };

        newInnerParcel = params.parcel._boundarySplit({handleChange});
        setOuterParcel(params.parcel);
        setInnerParcel(newInnerParcel);
    }

    let returnedParcel: Parcel = innerParcel || newInnerParcel;

    //
    // return
    //

    let control = {
        submitStatus
    };

    return [returnedParcel, control];
};
