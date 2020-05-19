// @flow
import Parcel from '../Parcel';
import BlueflagRecord from 'blueflag-record';
import map from 'unmutable/lib/map';

class MyRecord extends BlueflagRecord({
    foo: undefined,
    bar: undefined,
    baz: undefined,
}) {}

test('UnmutableCompatible.size should return size', () => {
    let parcel = new Parcel({
        value: new MyRecord({})
    });

    expect(parcel.size).toBe(3);
});

test('UnmutableCompatible.has(key) should return a boolean indicating if key exists', () => {
    let parcel = new Parcel({
        value: new MyRecord({})
    });

    expect(parcel.has('foo')).toBe(true);
    expect(parcel.has('bar')).toBe(true);
    expect(parcel.has('z')).toBe(false);
});


test('UnmutableCompatible.get(key) should return a new child Parcel', () => {
    let parcel = new Parcel({
        value: new MyRecord({foo: 123})
    });

    expect(parcel.get('foo').value).toBe(123);
});

test('UnmutableCompatible.get(key).set() should set', () => {
    let handleChange = jest.fn();
    let parcel = new Parcel({
        value: new MyRecord({foo: 123, bar: 999}),
        handleChange
    });

    parcel.get('foo').set(456);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value instanceof MyRecord).toBe(true);
    expect(handleChange.mock.calls[0][0].value.toObject()).toEqual({
        foo: 456,
        bar: 999,
        baz: undefined
    });
});

test('UnmutableCompatible.get(key).delete() should reset value at key', () => {
    let handleChange = jest.fn();
    let parcel = new Parcel({
        value: new MyRecord({foo: 123, bar: 999}),
        handleChange
    });

    parcel.get('foo').delete();
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value instanceof MyRecord).toBe(true);
    expect(handleChange.mock.calls[0][0].value.toObject()).toEqual({
        foo: undefined,
        bar: 999,
        baz: undefined
    });
});

test('UnmutableCompatible.children() should get child parcels in original collection', () => {
    let parcel = new Parcel({
        value: new MyRecord({foo: 123, bar: 999})
    });

    let children = parcel.children();
    expect(map(parcel => parcel.value)(children)).toEqual({
        foo: 123,
        bar: 999,
        baz: undefined
    });
});


