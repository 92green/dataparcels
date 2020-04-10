// @flow
import combine from '../parcelData/combine';

type Data = {
    value: any,
    meta: {[key: string]: any}
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
    effect: PromiseFunction
};

export default (config: Config) => {
    let {key} = config;
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
                update(() => ({
                    meta: {
                        [statusKey]: 'rejected',
                        [errorKey]: error
                    }
                }));
            }
        );

        return {
            meta,
            effect
        };
    };
};
