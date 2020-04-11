// @flow
import type ChangeRequest from '../change/ChangeRequest';

import combine from '../parcelData/combine';

type Data = {
    value: any,
    meta: {[key: string]: any},
    changeRequest: ChangeRequest
};

type PartialData = {
    value?: any,
    meta?: {[key: string]: any}
};

type Updater = (data: Data) => PartialData;
type Update = (updater: Updater) => void;
type PromiseFunction = (data: Data) => Promise<?PartialData|Updater>;

type Config = {
    key: string,
    effect: PromiseFunction,
    revert?: boolean,
    last?: boolean
};

export default (config: Config) => {
    let {key, revert, last} = config;
    let fn = config.effect;
    let count = 0;
    let chain = Promise.resolve();

    return (data: Data) => {

        let statusKey = `${key}Status`;
        let errorKey = `${key}Error`;
        let countAtCall = ++count;

        let meta = {
            [statusKey]: 'pending',
            [errorKey]: undefined
        };

        let effect = (update: Update) => {
            let lastChain = chain;
            chain = fn(data)
                .then(result => ({result}), error => ({error}))
                .then(data => lastChain.then((): any => data))
                .then(({result, error}) => {
                    if(last && count !== countAtCall) return;

                    if(error) {
                        result = revert ? data.changeRequest.prevData : {};
                    }

                    update(combine(
                        typeof result !== 'function' ? () => result : result,
                        () => ({
                            meta: {
                                [statusKey]: error ? 'rejected' : 'resolved',
                                [errorKey]: error
                            }
                        })
                    ));
                });
        };

        return {
            meta,
            effect
        };
    };
};
