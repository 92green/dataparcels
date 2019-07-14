// @flow
import Parcel from '../Parcel';
import {Map, List} from 'immutable';

test('Parcels should be able to accept no config', () => {
    let parcel = new Parcel();
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', () => {
    let parcel = new Parcel({
        value: 123
    });
    expect(123).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', () => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            expect(456).toBe(parcel.value);
        }
    });
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcel._changeAndReturn() should call action and return Parcel', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    });

    let [newParcel] = parcel._changeAndReturn((parcel) => {
        parcel.get('abc').onChange(789);
    });

    // expect correct parcel to be returned
    expect(newParcel.value).toEqual({
        abc: 789,
        def: 456
    });

    // expect parcel's handleChange to have not been called
    expect(handleChange).toHaveBeenCalledTimes(0);

    // now if parcel's change methods are called, handleChange should be called as usual
    parcel.get('abc').onChange(100);
    expect(handleChange).toHaveBeenCalledTimes(1);

    // also if new parcel's change methods are called, handleChange should be called as usual
    newParcel.get('abc').onChange(100);
    expect(handleChange).toHaveBeenCalledTimes(2);

    // _frameMeta should be passed through
    expect(parcel._frameMeta).toBe(newParcel._frameMeta);
});

test('Parcel._changeAndReturn() should return [parcel, undefined] if no changes are made', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    });

    let result = parcel._changeAndReturn(() => {});

    expect(result).toEqual([parcel, undefined]);
});

test('Parcel types should correctly identify primitive values', () => {
    var data = {
        value: 123
    };
    expect(new Parcel(data).isParent()).toBe(false);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify date', () => {
    var data = {
        value: new Date()
    };
    expect(new Parcel(data).isParent()).toBe(false);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify object values', () => {
    var data = {
        value: {
            a: "A"
        }
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify class instance values', () => {
    class Thing {
        foo = "123"
    }
    var data = {
        value: new Thing()
    };
    expect(new Parcel(data).isParent()).toBe(false);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify unmutable compatible class instance values', () => {
    class UnmutableCompatible {
        __UNMUTABLE_COMPATIBLE__ = true;
        foo = "123";
    }
    var data = {
        value: new UnmutableCompatible()
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});


test('Parcel types should correctly identify Immutable.js Map values', () => {
    var data = {
        value: Map({
            a: "A"
        })
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(false);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});


test('Parcel types should correctly identify array values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(true);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify Immutable.js List values', () => {
    var data = {
        value: List([1,2,3])
    };
    expect(new Parcel(data).isParent()).toBe(true);
    expect(new Parcel(data).isIndexed()).toBe(true);
    expect(new Parcel(data).isChild()).toBe(false);
    expect(new Parcel(data).isElement()).toBe(false);
    expect(new Parcel(data).isTopLevel()).toBe(true);
});

test('Parcel types should correctly identify child values', () => {
    var data = {
        value: {
            a: "A"
        }
    };
    expect(new Parcel(data).get("a").isParent()).toBe(false);
    expect(new Parcel(data).get("a").isIndexed()).toBe(false);
    expect(new Parcel(data).get("a").isChild()).toBe(true);
    expect(new Parcel(data).get("a").isElement()).toBe(false);
    expect(new Parcel(data).get("a").isTopLevel()).toBe(false);
});

test('Parcel types should correctly identify element values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).get(0).isParent()).toBe(false);
    expect(new Parcel(data).get(0).isIndexed()).toBe(false);
    expect(new Parcel(data).get(0).isChild()).toBe(true);
    expect(new Parcel(data).get(0).isElement()).toBe(true);
    expect(new Parcel(data).get(0).isTopLevel()).toBe(false);
});

test('Parcel types should correctly identify top level values after modifiers', () => {
    var data = {
        value: [1,2,3]
    };
    expect(new Parcel(data).modifyDown(ii => ii).isTopLevel()).toBe(true);
});

// method creators

test('Correct methods are created for primitive values', () => {
    var data = {
        value: 123
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for object values', () => {
    var data = {
        value: {a: 123}
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).not.toThrow();
    expect(() => new Parcel(data).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for array values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(() => new Parcel(data).value).not.toThrow();
    expect(() => new Parcel(data).has('a')).not.toThrow();
    expect(() => new Parcel(data).pop()).not.toThrow();
    expect(() => new Parcel(data).delete()).toThrowError(`.delete() cannot be called with 0 arguments`);
    expect(() => new Parcel(data).swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for object child values', () => {
    var data = {
        value: {a: 123}
    };
    expect(() => new Parcel(data).get("a").value).not.toThrow();
    expect(() => new Parcel(data).get("a").has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).get("a").pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).get("a").delete()).not.toThrow();
    expect(() => new Parcel(data).get("a").swapNext()).toThrowError(`.swapNext() cannot be called with 0 arguments`);
});

test('Correct methods are created for array element values', () => {
    var data = {
        value: [1,2,3]
    };
    expect(() => new Parcel(data).get(0).value).not.toThrow();
    expect(() => new Parcel(data).get(0).has('a')).toThrowError(`.has() is not a function`);
    expect(() => new Parcel(data).get(0).pop()).toThrowError(`.pop() is not a function`);
    expect(() => new Parcel(data).get(0).delete()).not.toThrow();
    expect(() => new Parcel(data).get(0).swapNext()).not.toThrow();
});

test('Frame meta should be passed down to child parcels', () => {
    let parcel = new Parcel({
        value: [[123]]
    });

    parcel._frameMeta.foo = 123;

    expect(parcel.get(0)._frameMeta.foo).toBe(123);
    expect(parcel.get(0).get(0)._frameMeta.foo).toBe(123);
});

test('Frame meta should not persist after change', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    parcel._frameMeta.foo = "bar";
    parcel.set(456);

    expect(handleChange.mock.calls[0][0]._frameMeta).toEqual({});
});

