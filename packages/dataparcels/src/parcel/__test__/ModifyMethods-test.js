// @flow
// import update from 'unmutable/lib/update';

import ChangeRequest from '../../change/ChangeRequest';
import Parcel from '../Parcel';
import cancel from '../../change/cancel';
import arrange from '../../parcelNode/arrange';

jest.useFakeTimers();

describe('Parcel.modifyDown()', () => {

    it('should return a new parcel with updated parcelData', () => {
        let updater = jest.fn(({value}) => ({
            value: value + 1
        }));

        var data = {
            value: [123]
        };
        var parcel = new Parcel(data).get(0);
        var updated = parcel
            .modifyDown(updater)
            .data;

        var expectedData = {
            meta: {},
            child: undefined,
            value: 124,
            key: "#0"
        };
        expect(updated).toEqual(expectedData);
        expect(updater.mock.calls[0][0]).toEqual(parcel.data);
    });

    it('should merge meta', () => {
        let handleChange = jest.fn();
        let updater = jest.fn(({value}) => ({
            value: value + 1
        }));

        var parcel = new Parcel({
            value: 123,
            handleChange
        })
            .setMeta({abc: 100, def: 200});

        let newParcel = handleChange.mock.calls[0][0].modifyDown(({meta}) => {
            return {
                meta: {
                    def: 400,
                    ghi: 300
                }
            };
        });

        expect(newParcel.meta).toEqual({
            abc: 100,
            def: 400,
            ghi: 300
        });
    });

    it('should not destroy child data', () => {
        let handleChange = jest.fn();
        let updater = jest.fn(({value}) => ({
            value: value + 1
        }));

        var parcel = new Parcel({
            value: [123],
            handleChange
        })
            .get(0)
            .setMeta({def: 456});

        let newParcel = handleChange.mock.calls[0][0].modifyDown(ii => ii);

        expect(newParcel.data.child).toEqual([
            {
                key: '#0',
                child: undefined,
                meta: {
                    def: 456
                }
            }
        ]);
    });

    it('should allow undefined to be returned', () => {
        let parcel = new Parcel({value: 123});
        expect(parcel.modifyDown(() => {}).data).toEqual(parcel.data);
    });

    it('should recognise if value changes types, and set value if type changes', () => {
        let handleChange = jest.fn();
        let parcel = new Parcel({
            value: 123,
            handleChange
        })
            .modifyDown(({value}) => ({value: []}))
            .push(123);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123]);
    });

    it.skip('should have id which is unique to updater', () => {
        let updater = () => ({value: []});
        let updater2 = ({value}) => ({value: 123});

        let sameA1 = new Parcel().modifyDown(updater);
        let sameA2 = new Parcel().modifyDown(updater);
        let differentA = new Parcel().modifyDown(updater2);

        let sameB1 = new Parcel().modifyDown(arrange(updater));
        let sameB2 = new Parcel().modifyDown(arrange(updater));
        let differentB = new Parcel().modifyDown(arrange(a => 1 + 2));

        expect(sameA1.id).toBe(sameA2.id);
        expect(sameA1.id).not.toBe(differentA.id);
        expect(sameB1.id).toBe(sameB2.id);
        expect(sameB1.id).not.toBe(differentB.id);
    });
});

describe('Parcel.modifyUp()', () => {

    it.skip('should have id which is unique to updater', () => {
        let updater = () => ({value: []});
        let updater2 = ({value}) => ({value: 123});

        let sameA1 = new Parcel().modifyUp(updater);
        let sameA2 = new Parcel().modifyUp(updater);
        let differentA = new Parcel().modifyUp(updater2);

        let sameB1 = new Parcel().modifyUp(arrange(updater));
        let sameB2 = new Parcel().modifyUp(arrange(updater));
        let differentB = new Parcel().modifyUp(arrange(a => 1 + 2));

        expect(sameA1.id).toBe(sameA2.id);
        expect(sameA1.id).not.toBe(differentA.id);
        expect(sameB1.id).toBe(sameB2.id);
        expect(sameB1.id).not.toBe(differentB.id);
    });

    it('should allow you to change the payload of a changed parcel with an updater (and should allow non-parent types to be returned)', () => {
        let handleChange = jest.fn();
        let updater = jest.fn(({value}) => ({value: value + 1}));

        new Parcel({
            value: 123,
            handleChange
        })
            .modifyUp(updater)
            .set(456);

        expect(handleChange.mock.calls[0][0].value).toBe(457);

        let {value, changeRequest} = updater.mock.calls[0][0];
        expect(value).toBe(456);
        expect(changeRequest instanceof ChangeRequest).toBe(true);
        expect(changeRequest.prevData.value).toBe(123);
        expect(changeRequest.nextData.value).toBe(456);
    });

    it('should allow changes to meta through', () => {
        expect.assertions(1);

        var data = {
            value: 123,
            handleChange: (parcel: Parcel) => {
                let {value, meta} = parcel.data;
                expect({abc: 123}).toEqual(meta);
            }
        };

        new Parcel(data)
            .modifyUp(({value}) => ({value: value + 1}))
            .update(() => ({
                meta: {
                    abc: 123
                }
            }));
    });

    it('should allow undefined to be returned', () => {
        let handleChange = jest.fn();

        new Parcel({
            value: 123,
            handleChange
        })
            .modifyUp(() => undefined)
            .set(456);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should cancel a change if cancel is returned', () => {

        let handleChange = jest.fn();
        let updater = jest.fn(() => cancel);

        let parcel = new Parcel({
            handleChange,
            value: [1,2,3]
        });

        let parcelWithModifier = parcel.modifyUp(updater);
        parcelWithModifier.push(4);

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should cancel a change if a value of cancel is returned', () => {

        let handleChange = jest.fn();
        let updater = jest.fn(() => ({
            value: cancel
        }));

        let parcel = new Parcel({
            handleChange,
            value: [1,2,3]
        });

        let parcelWithModifier = parcel.modifyUp(updater);
        parcelWithModifier.push(4);

        expect(handleChange).not.toHaveBeenCalled();
    });

    describe('Parcel.modifyUp() effect', () => {
        it('should call an effect shortly after running the change through a change reducer', async () => {

            let handleChange = jest.fn();
            let parcel = new Parcel({
                handleChange,
                value: 100
            });

            parcel
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .set(200);

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].value).toBe(200);

            jest.advanceTimersByTime(500);

            expect(handleChange).toHaveBeenCalledTimes(2);
            expect(handleChange.mock.calls[1][0].value).toBe(201);
        });

        it('should call the effect only once, even if it goes through change reducer multiple times', async () => {

            let handleChange = jest.fn();
            let parcel = new Parcel({
                handleChange,
                value: 100
            });

            parcel
                .modifyUp(({changeRequest}) => {
                    changeRequest.next; // force a second execution of the change reducer
                })
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .set(200);

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].value).toBe(200);

            jest.advanceTimersByTime(500);

            expect(handleChange).toHaveBeenCalledTimes(2);
            expect(handleChange.mock.calls[1][0].value).toBe(201);
        });

        it('should allow multiple calls to effect update()', async () => {

            let handleChange = jest.fn();
            let parcel = new Parcel({
                handleChange,
                value: 100
            });

            parcel
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                        update(({value}) => ({value: value + 2}));
                    }
                }))
                .set(200);

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].value).toBe(200);

            jest.advanceTimersByTime(500);

            expect(handleChange).toHaveBeenCalledTimes(3);
            expect(handleChange.mock.calls[1][0].value).toBe(201);
            expect(handleChange.mock.calls[2][0].value).toBe(203);
        });

        it('should allow multiple modifiers to calls effect update()', async () => {

            let handleChange = jest.fn();
            let parcel = new Parcel({
                handleChange,
                value: 100
            });

            parcel
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .set(200);

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].value).toBe(200);

            jest.advanceTimersByTime(500);

            expect(handleChange).toHaveBeenCalledTimes(3);
            expect(handleChange.mock.calls[1][0].value).toBe(201);
            expect(handleChange.mock.calls[2][0].value).toBe(202);
        });

        it('should allow multiple modifiers to calls effect update()', async () => {

            let handleChange = jest.fn();
            let parcel = new Parcel({
                handleChange,
                value: 100
            });

            parcel
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .modifyUp(() => ({
                    effect: (update) => {
                        update(({value}) => ({value: value + 1}));
                    }
                }))
                .set(200);

            expect(handleChange).toHaveBeenCalledTimes(1);
            expect(handleChange.mock.calls[0][0].value).toBe(200);

            jest.advanceTimersByTime(500);

            expect(handleChange).toHaveBeenCalledTimes(3);
            expect(handleChange.mock.calls[1][0].value).toBe(201);
            expect(handleChange.mock.calls[2][0].value).toBe(202);
        });
    });
});

describe('Parcel.initialMeta()', () => {

    it('should work', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        }).initialMeta({a:1, b:2});

        expect(parcel.data).toEqual({
            value: 123,
            meta: {
                a: 1,
                b: 2
            },
            child: undefined,
            key: "^"
        });

        parcel.setMeta({b: 3});

        expect(handleChange.mock.calls[0][0].data).toEqual({
            value: 123,
            meta: {
                a: 1,
                b: 3
            },
            child: undefined,
            key: "^"
        });
    });

    it('should merge', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        })
            .initialMeta({a:1, b:2})
            .initialMeta({b:3, c:4})

        expect(parcel.data).toEqual({
            value: 123,
            meta: {
                a: 1,
                b: 2,
                c: 4
            },
            child: undefined,
            key: "^"
        });

        parcel.setMeta({d: 5});

        expect(handleChange.mock.calls[0][0].data).toEqual({
            value: 123,
            meta: {
                a: 1,
                b: 2,
                c: 4,
                d: 5
            },
            child: undefined,
            key: "^"
        });
    });

    it('should do nothing to data if all meta keys are already set', () => {

        let parcel = new Parcel({
            value: 123
        }).initialMeta({a:1, b:2});

        let parcel2 = parcel.initialMeta({a:1, b:2});

        expect(parcel2.data).toEqual(parcel.data);
    });
});
