// @flow
import arrange from '../arrange';
import ParcelNode from '../ParcelNode';
import reverse from 'unmutable/reverse';
import toArray from 'unmutable/toArray';

test('arrange should accept updater', () => {
    let parcelData = {
        value: 123,
        meta: {
            foo: true
        }
    };

    expect(arrange(value => value)(parcelData)).toEqual(parcelData);
});

test('arrange should update non-parent values', () => {
    let parcelData = {
        value: 100
    };
    let result = arrange(value => value + 200)(parcelData);
    expect(result.value).toBe(300);
});

test('arrange should update non-parent values and keep meta and key', () => {
    let parcelData = {
        value: 100,
        meta: {foo: true},
        key: 'aaa'
    };

    let result = arrange(value => value + 200)(parcelData);

    expect(result.value).toBe(300);
    expect(result.meta).toEqual({foo: true});
    expect(result.key).toBe('aaa');
});

test('arrange should update parent values to non-parent values', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(value => value.map(node => node.value).join(", "))(parcelData);
    expect(result.value).toBe('1, 2, 3');
});

test('arrange should update parent values', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(reverse())(parcelData);

    expect(result.value).toEqual([3,2,1]);
    expect(result.child[2].key).toBe('#a');
});

test('arrange should update parent values changing type', () => {
    let parcelData = {
        value: {foo: 'bar', baz: 'qux'}
    };

    let result = arrange(toArray())(parcelData);

    expect(result.value).toEqual(['bar', 'qux']);
    // keys should have been recalculated
    expect(result.child[0].key).toBe('#a');
});

test('arrange should update parent values adding a new ParcelNode', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, new ParcelNode(4)])(parcelData);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.child[3].key).toBe('#d');
});

test('arrange should update parent values adding a new non-ParcelNode', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, 4])(parcelData);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.child[3].key).toBe('#d');
});

test('arrange should update parent values adding duplicated ParcelNodes', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let result = arrange(arr => [...arr, ...arr])(parcelData);
    expect(result.value).toEqual([1,2,3,1,2,3]);
    expect(result.child[3].key).toBe('#d');
    expect(result.child[4].key).toBe('#e');
    expect(result.child[5].key).toBe('#f');
});
