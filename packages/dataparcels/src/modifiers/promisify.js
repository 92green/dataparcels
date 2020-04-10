// @flow

type Data = {
    value: any,
    meta: {[key: string]: any}
};

type PartialData = {
    value?: any,
    meta?: {[key: string]: any}
};

type PromiseFunction = (data: Data) => Promise<?PartialData>;
type Update = (updater: (data: Data) => PartialData) => void;

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
            (data) => {
                if(count !== countAtCall) return;
                data = data || {};
                update(() => ({
                    ...data,
                    meta: {
                        // $FlowFixMe - this inference is wrong, data cannot be undefined here
                        ...(data.meta || {}),
                        [statusKey]: 'resolved',
                        [errorKey]: undefined
                    }
                }));
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
