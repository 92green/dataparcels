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
    revert?: boolean
};

export default (config: Config) => {
    let {key, revert} = config;
    let fn = config.effect;
    let count = 0;

    return (data: Data) => {

        let statusKey = `${key}Status`;
        let errorKey = `${key}Error`;
        let countAtCall = ++count;

        let meta = {
            [statusKey]: 'pending',
            [errorKey]: undefined
        };

        let effect = (update: Update) => fn(data).then(
            (result) => {
                if(count !== countAtCall) return;
                update(combine(
                    typeof result !== 'function' ? () => result : result,
                    () => ({
                        meta: {
                            [statusKey]: 'resolved',
                            [errorKey]: undefined
                        }
                    })
                ));
            },
            (error) => {
                if(count !== countAtCall) return;
                update(combine(
                    () => revert ? data.changeRequest.prevData : {},
                    () => ({
                        meta: {
                            [statusKey]: 'rejected',
                            [errorKey]: error
                        }
                    })
                ));
            }
        );

        return {
            meta,
            effect
        };
    };
};
