// @flow
import promisify from '../promisify';
import Parcel from '../../parcel/Parcel';

let allResolvedPromises = async () => {
    // for jest to await Promise.resolve() that are not explicitly returned
    // you need to call a await Promise.resolve(); for each Promise.resolve()
    // these tests shouldnt have to care how many internl Promise.resolve()s there are
    // so just call it heaps
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

describe('promisify', () => {
    it('should fire promise and resolve', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let promisifiedParcel = parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: () => Promise.resolve()
            }));

        expect(promisifiedParcel.value).toBe(123);
        expect(promisifiedParcel.meta.fooStatus).toBe(undefined);
        expect(promisifiedParcel.meta.fooError).toBe(undefined);

        promisifiedParcel.set(456);

        expect(handleChange).toHaveBeenCalledTimes(1);

        let newParcel = handleChange.mock.calls[0][0];
        expect(newParcel.value).toBe(456);
        expect(newParcel.meta.fooStatus).toBe('pending');
        expect(newParcel.meta.fooError).toBe(undefined);

        await allResolvedPromises();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(456);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('resolved');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe(undefined);

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and resolve with updated data', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: ({value}) => Promise.resolve({
                    value: value + 1
                })
            }))
            .set(456);

        await allResolvedPromises();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(457);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('resolved');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe(undefined);

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and resolve using an updater function', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();
        let updater = jest.fn(({value}) => ({
            value: value + 1
        }));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let resolvePromise = () => {};
        let promise = new Promise(resolve => {
            resolvePromise = () => resolve(updater);
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: ({value}) => promise
            }))
            .set(456);

        parcel
            .set(700);

        resolvePromise();
        await promise;

        await allResolvedPromises();

        expect(handleChange).toHaveBeenCalledTimes(3);

        expect(updater).toHaveBeenCalledTimes(1);
        expect(updater.mock.calls[0][0].value).toBe(700);
        expect(handleChange.mock.calls[2][0].value).toBe(701);

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and reject', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: () => Promise.reject('error!')
            }))
            .set(456);

        await allResolvedPromises();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(456);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('rejected');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe('error!');

        window.setTimeout = realSetTimeout;
    });

    it('should fire promise and reject and revert', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        parcel
            .modifyUp(promisify({
                key: 'foo',
                effect: () => Promise.reject('error!'),
                revert: true
            }))
            .set(456);

        await allResolvedPromises();

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toBe(123);
        expect(handleChange.mock.calls[1][0].meta.fooStatus).toBe('rejected');
        expect(handleChange.mock.calls[1][0].meta.fooError).toBe('error!');

        window.setTimeout = realSetTimeout;
    });

    it('should process results in the same order they were fired', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: '',
            handleChange
        });

        let resolveFirstPromise = () => {};
        let firstPromise = new Promise(resolve => {
            resolveFirstPromise = () => resolve({
                value: 'first-resolved'
            });
        });

        let resolveSecondPromise = () => {};
        let secondPromise = new Promise(resolve => {
            resolveSecondPromise = () => resolve({
                value: 'second-resolved'
            });
        });

        let resolveThirdPromise = () => {};
        let thirdPromise = new Promise(resolve => {
            resolveThirdPromise = () => resolve({
                value: 'third-resolved'
            });
        });

        let promiseUpdater = promisify({
            key: 'foo',
            effect: ({value}) => {
                if(value === 'first') {
                    return firstPromise;
                }
                if(value === 'second') {
                    return secondPromise;
                }
                return thirdPromise;
            }
        });

        parcel
            .modifyUp(promiseUpdater)
            .set('first');

        handleChange.mock.calls[0][0]
            .modifyUp(promiseUpdater)
            .set('second');

        handleChange.mock.calls[1][0]
            .modifyUp(promiseUpdater)
            .set('third');

        expect(handleChange).toHaveBeenCalledTimes(3);

        resolveThirdPromise();
        await thirdPromise;

        resolveFirstPromise();
        await firstPromise;

        resolveSecondPromise();
        await secondPromise.catch(() => {});

        // now that 3rd has a
        expect(handleChange).toHaveBeenCalledTimes(6);
        expect(handleChange.mock.calls[3][0].value).toBe('first-resolved');
        expect(handleChange.mock.calls[4][0].value).toBe('second-resolved');
        expect(handleChange.mock.calls[5][0].value).toBe('third-resolved');

        window.setTimeout = realSetTimeout;
    });

    it('should only allow update from most recently fired promise if last = true', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: '',
            handleChange
        });

        let resolveFirstPromise = () => {};
        let firstPromise = new Promise(resolve => {
            resolveFirstPromise = () => resolve({
                value: 'first-resolved'
            });
        });

        let resolveSecondPromise = () => {};
        let secondPromise = new Promise((resolve, reject) => {
            resolveSecondPromise = () => reject('second-rejected');
        });

        let resolveThirdPromise = () => {};
        let thirdPromise = new Promise(resolve => {
            resolveThirdPromise = () => resolve({
                value: 'third-resolved'
            });
        });

        let promiseUpdater = promisify({
            key: 'foo',
            effect: ({value}) => {
                if(value === 'first') {
                    return firstPromise;
                }
                if(value === 'second') {
                    return secondPromise;
                }
                return thirdPromise;
            },
            last: true
        });

        parcel
            .modifyUp(promiseUpdater)
            .set('first');

        handleChange.mock.calls[0][0]
            .modifyUp(promiseUpdater)
            .set('second');

        handleChange.mock.calls[1][0]
            .modifyUp(promiseUpdater)
            .set('third');

        expect(handleChange).toHaveBeenCalledTimes(3);


        resolveThirdPromise();
        await thirdPromise;

        resolveFirstPromise();
        await firstPromise;

        resolveSecondPromise();
        await secondPromise.catch(() => {});

        expect(handleChange).toHaveBeenCalledTimes(4);
        expect(handleChange.mock.calls[3][0].value).toBe('third-resolved');

        window.setTimeout = realSetTimeout;
    });
});
