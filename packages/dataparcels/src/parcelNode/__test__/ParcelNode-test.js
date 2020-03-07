// @flow
import ParcelNode from '../ParcelNode';
import reverse from 'unmutable/reverse';
import toArray from 'unmutable/toArray';

test('ParcelNodes should accept value', () => {
    let node = new ParcelNode(123);
    expect(node.value).toEqual(123);
});

test('ParcelNodes should return data', () => {
    let node = new ParcelNode(123);
    expect(node.data).toEqual({
        value: 123
    });
});

test('ParcelNodes should return empty meta object', () => {
    let node = new ParcelNode(123);
    expect(node.meta).toEqual({});
});

test('ParcelNodes should get() lazily', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.get(0);

    expect(result._key).toBe('#a');
    expect(result._parent).toBe(node);
    expect(result._parcelData).toBe(undefined);

    let data = result.data;

    let expected = {
        value: 1,
        meta: {},
        key: '#a'
    };

    expect(data).toEqual(expected);
    expect(result._parcelData).toEqual(expected);
});

test('ParcelNodes should get() lazily with exisitng child data', () => {
    let node = new ParcelNode();
    node._parcelData = {
        value: [1],
        key: '^',
        meta: {},
        child: [
            {key: '#z', meta: {foo: true}}
        ]
    };

    let result = node.get(0);

    expect(result._key).toBe('#z');

    let data = result.data;

    let expected = {
        value: 1,
        meta: {foo: true},
        key: '#z'
    };

    expect(data).toEqual(expected);
    expect(result._parcelData).toEqual(expected);
});

test('ParcelNodes should setMeta()', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.setMeta({foo: true}).setMeta({bar: false});
    expect(result.meta).toEqual({foo: true, bar: false});
});


test('ParcelNodes should update() non-parent values', () => {
    let node = new ParcelNode(100);
    let result = node.update(({value}) => ({value: value + 200}));
    expect(result.value).toBe(300);
});

test('ParcelNodes should update() non-parent values and keep meta and key', () => {
    let node = new ParcelNode();
    node._parcelData = {
        value: 100,
        meta: {foo: true},
        key: 'aaa'
    };
    let result = node.update(({value}) => ({value: value + 200}));
    expect(result.value).toBe(300);
    expect(result.meta).toEqual({foo: true});
    expect(result.key).toBe('aaa');
});

test('ParcelNodes should update() parent values without replacing children with nodes', () => {
    let node = new ParcelNode();
    node._parcelData = {
        value: [1,2,3]
    };

    let updater = jest.fn(data => data);

    let result = node.update(updater);

    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0].value).toEqual([1,2,3]);
});
