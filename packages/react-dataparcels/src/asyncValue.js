// @flow

// $FlowFixMe - useState is a named export of react
import {useState} from 'react';

type AsyncValueGetter = () => Promise<any>;
type SetParcelValue = (value: any) => void;

export default (asyncValueGetter: AsyncValueGetter) => {

    let useAsyncValue = (setParcelValue: SetParcelValue) => {

        let getAsyncStatus = (params: any) => {
            let {status} = params;
            let error = status === 'rejected' ? params.error : undefined;

            return {
                status,
                isPending: status === 'pending',
                isResolved: status === 'resolved',
                isRejected: status === 'rejected',
                error
            };
        };

        const [asyncStatus, setAsyncStatus] = useState(() => getAsyncStatus({
            status: 'pending'
        }));

        const resolved = (newValue: any) => {
            setAsyncStatus(getAsyncStatus({
                status: 'resolved'
            }));
            setParcelValue(newValue);
        };

        const rejected = (error: any) => {
            setAsyncStatus(getAsyncStatus({
                status: 'rejected',
                error
            }));
        };

        let getValue = () => {
            asyncValueGetter().then(resolved, rejected);
        };

        return [getValue, asyncStatus];
    };

    useAsyncValue._asyncValue = true;

    return useAsyncValue;
};
