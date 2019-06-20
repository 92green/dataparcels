// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelForm from '../useParcelForm';


describe('useParcelForm should revert change request', () => {

    it('should put changes back into buffer from rejected onSubmit', async () => {
        let rejectMyPromise;
        let promise = new Promise((resolve, reject) => {
            rejectMyPromise = () => {
                reject();
                return promise.catch(() => {});
            };
        });

        let {result} = renderHook(() => useParcelForm({
            value: [],
            onSubmit: () => promise
        }));

        act(() => {
            result.current[0].push(123);
        });

        expect(result.current[1].actions.length).toBe(1);
        let firstAction = result.current[1].actions[0];

        act(() => {
            result.current[1].submit();
        });

        expect(result.current[1].actions.length).toBe(0);

        await act(async () => {
            await rejectMyPromise();
        });

        expect(result.current[0].value).toEqual([123]);
        expect(result.current[1].actions.length).toBe(1);
        expect(result.current[1].actions[0]).toBe(firstAction);
    });

    it('should put changes back into buffer from rejected onSubmit, onto new changes', async () => {
        let rejectMyPromise;
        let promise = new Promise((resolve, reject) => {
            rejectMyPromise = () => {
                reject();
                return promise.catch(() => {});
            };
        });

        let {result} = renderHook(() => useParcelForm({
            value: [],
            onSubmit: () => promise
        }));

        act(() => {
            result.current[0].push(123);
        });

        expect(result.current[1].actions.length).toBe(1);
        let firstAction = result.current[1].actions[0];

        act(() => {
            result.current[1].submit();
        });

        expect(result.current[1].actions.length).toBe(0);

        act(() => {
            result.current[0].push(456);
        });

        expect(result.current[1].actions.length).toBe(1);
        let secondAction = result.current[1].actions[0];

        await act(async () => {
            await rejectMyPromise();
        });

        expect(result.current[0].value).toEqual([123,456]);
        expect(result.current[1].actions.length).toBe(2);
        expect(result.current[1].actions[0]).toBe(firstAction);
        expect(result.current[1].actions[1]).toBe(secondAction);
    });
});
