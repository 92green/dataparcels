// @flow
import Parcel from '../Parcel';
import ChangeRequest from '../../change/ChangeRequest';
import Action from '../../change/Action';
import TypeSet from '../../typeHandlers/TypeSet';

test('Parcels should be able to accept no config', () => {
    let parcel = new Parcel();
    expect(undefined).toEqual(parcel.value);
    parcel.set(123);
});

test('Parcels should be able to accept just value in config', () => {
    let parcel = new Parcel({
        value: 123
    });
    expect(123).toEqual(parcel.value);
    parcel.set(456);
});

test('Parcels should be able to accept just handleChange in config', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        handleChange
    });

    expect(parcel.value).toBe(undefined);
    parcel.set(456);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toBe(456);
});

test('Parcels should be able to accept types in config', () => {
    let types = jest.fn(ii => ii);

    let parcel = new Parcel({
        types
    });

    expect(types).toHaveBeenCalledTimes(1);
    expect(types.mock.calls[0][0]).toEqual(TypeSet.defaultTypes);
    expect(parcel._treeShare.typeSet.types).toBe(TypeSet.defaultTypes);
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
        parcel.get('abc').set(789);
    });

    // expect correct parcel to be returned
    expect(newParcel.value).toEqual({
        abc: 789,
        def: 456
    });

    // expect parcel's handleChange to have not been called
    expect(handleChange).toHaveBeenCalledTimes(0);

    // now if parcel's change methods are called, handleChange should be called as usual
    parcel.get('abc').set(100);
    expect(handleChange).toHaveBeenCalledTimes(1);

    // also if new parcel's change methods are called, handleChange should be called as usual
    newParcel.get('abc').set(100);
    expect(handleChange).toHaveBeenCalledTimes(2);
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

test('Parcel._boundarySplit should allow handleChange', () => {
    let handleChange = jest.fn();
    let withSplit = new Parcel({value: 1})._boundarySplit(handleChange);
    withSplit.set(2);

    expect(withSplit.value).toBe(1);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toBe(2);
});

test('Parcel.isChild types should correctly identify child values', () => {
    expect(new Parcel({value: 1}).isChild).toBe(false);
    expect(new Parcel({value: [1]}).get(0).isChild).toBe(true);
    expect(new Parcel({value: [1]}).modifyDown(ii => ii).get(0).isChild).toBe(true);
    expect(new Parcel({value: [[1]]}).get(0).get(0).isChild).toBe(true);
});

test('Parcel.isParent types should correctly identify parent values', () => {
    expect(new Parcel({value: 1}).isParent).toBe(false);
    expect(new Parcel({value: [1]}).isParent).toBe(true);
    expect(new Parcel({value: [1]}).modifyDown(ii => ii).isParent).toBe(true);
    expect(new Parcel({value: [[1]]}).get(0).get(0).isParent).toBe(false);
});


test('Parcel.type should correctly identify type', () => {
    class Thing {
        foo = "123"
    }

    class UnmutableCompatible {
        __UNMUTABLE_COMPATIBLE__ = true;
        foo = "123";
    }

    expect(new Parcel({value: 123}).type).toBe('basic');
    expect(new Parcel({value: {a: "A"}}).type).toBe('object');
    expect(new Parcel({value: []}).type).toBe('array');
    expect(new Parcel({value: new Date()}).type).toBe('object'); // wont work, but this classification is correct
    expect(new Parcel({value: new Thing()}).type).toBe('object'); // wont work, but this classification is correct
    expect(new Parcel({value: new UnmutableCompatible()}).type).toBe('object'); // wont work, but this classification is correct
});

test('Parcel.type should correctly identify parent type', () => {
    expect(new Parcel({value: 123}).parentType).toBe(undefined);
    expect(new Parcel({value: {a: "A"}}).parentType).toBe(undefined);
    expect(new Parcel({value: {a: "A"}}).get('a').parentType).toBe('object');
    expect(new Parcel({value: [123]}).get(0).parentType).toBe('array');
});

