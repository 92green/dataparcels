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

test('ParcelNodes should throw errors when attempted to set getters', () => {
    let readOnly = 'This property is read-only';

    let node = new ParcelNode(123);

    expect(() => {
        node.data = 123;
    }).toThrow(readOnly);

    expect(() => {
        node.value = 123;
    }).toThrow(readOnly);

    expect(() => {
        node.meta = 123;
    }).toThrow(readOnly);

    expect(() => {
        node.key = 123;
    }).toThrow(readOnly);

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
    let result = node.update(value => value + 200);
    expect(result.value).toBe(300);
});

test('ParcelNodes should update() non-parent values and keep meta and key', () => {
    let node = new ParcelNode();
    node._parcelData = {
        value: 100,
        meta: {foo: true},
        key: 'aaa'
    };
    let result = node.update(value => value + 200);
    expect(result.value).toBe(300);
    expect(result.meta).toEqual({foo: true});
    expect(result.key).toBe('aaa');
});

test('ParcelNodes should update() parent values to non-parent values', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.update(value => value.map(node => node.value).join(", "));
    expect(result.value).toBe('1, 2, 3');
});

test('ParcelNodes should update() parent values', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.update(reverse());
    expect(result.value).toEqual([3,2,1]);
    expect(result.get('#a').value).toBe(1);
});

test('ParcelNodes should update() parent values changing type', () => {
    let node = new ParcelNode({foo: 'bar', baz: 'qux'});
    let result = node.update(toArray());
    expect(result.value).toEqual(['bar', 'qux']);
    // keys should have been recalculated
    expect(result.get('#a').value).toBe('bar');
});

test('ParcelNodes should update() parent values adding a new ParcelNode', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.update(arr => [...arr, new ParcelNode(4)]);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.get('#d').value).toBe(4);
});

test('ParcelNodes should update() parent values adding a new non-ParcelNode', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.update(arr => [...arr, 4]);
    expect(result.value).toEqual([1,2,3,4]);
    expect(result.get('#d').value).toBe(4);
});

test('ParcelNodes should update() parent values adding duplicated ParcelNodes', () => {
    let node = new ParcelNode([1,2,3]);
    let result = node.update(arr => [...arr, ...arr]);
    expect(result.value).toEqual([1,2,3,1,2,3]);
    expect(result.get('#d').value).toBe(1);
    expect(result.get('#e').value).toBe(2);
    expect(result.get('#f').value).toBe(3);
});

test('ParcelNodes should update() parent values adding ParcelNodes from other parcelnodes', () => {
    let node = new ParcelNode([1,2,[3],4,5]);
    let grandchild = node.get(2).get(0); // will have a value of 3
    let result = node.update(arr => [arr[3], grandchild]);
    expect(result.value).toEqual([4,3]);
    expect(result.get(0).key).toBe('#d');
    expect(result.get(1).key).toBe('#f');
});
