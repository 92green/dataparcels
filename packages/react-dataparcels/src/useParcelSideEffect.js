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
    onChange?: (parcel: Parcel, changeRequest: ChangeRequest) => any|Promise<any>,
    onChangeUseResult?: boolean
};

type Return = [Parcel];

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
    const pendingRef = useRef(false);

    //
    // queue processing
    //

    const processChangeDone = (onDispatch: Function) => (result: any) => {
        pendingRef.current = false;
        if(queueRef.current.length > 1) {
            processChange();
        } else {
            let [newParcel, changeRequest] = queueRef.current.shift();
            onDispatch(newParcel, changeRequest, result);
        }
    };

    const processChangeSuccess = processChangeDone((newParcel: Parcel, changeRequest: ChangeRequest, result: any) => {

        if(params.onChange && params.onChangeUseResult) {
            let [/*parcel*/, changeRequestWithResult] = newParcel._changeAndReturn(
                newParcel => newParcel.set(result)
            );
            changeRequestWithResult._originId = changeRequest._originId;
            changeRequestWithResult._originPath = changeRequest._originPath;
            changeRequest = changeRequestWithResult;
        }

        params.parcel.dispatch(changeRequest);
    });

    const processChangeError = processChangeDone(() => {
        queueRef.current = [];
        // in future, revert the change request, as this obviously hasn't gone well...
    });

    const processChange = () => {
        let {onChange} = params;

        // if no onChange is present, success! skip to the end
        if(!onChange) {
            processChangeSuccess();
            return;
        }

        // merge remaining changes in the queue together
        queueRef.current = mergeQueue(params.parcel, queueRef.current);
        let result = onChange(...queueRef.current[0]);

        // if a promise isn't returned, success! skip to the end
        if(!isPromise(result)) {
            processChangeSuccess(result);
            return;
        }

        pendingRef.current = true;
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

            // if nothing is pending, then call onChange
            if(!pendingRef.current) {
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

    return [returnedParcel];
};
