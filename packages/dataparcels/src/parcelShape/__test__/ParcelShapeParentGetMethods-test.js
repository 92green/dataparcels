// @flow
import ParcelShape from '../ParcelShape';

import map from 'unmutable/lib/map';

test('ParcelShapes getters should work', () => {
    let data = {
        value: [0,1,2],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    let parcel = ParcelShape.fromData(data);
    expect(parcel.meta).toEqual(data.meta);
    expect(parcel.key).toEqual(data.key);
});

test('ParcelShapes.get should work with objects', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: {
                b: 1
            }
        }
    });

    let expectedParcelData = {
        value: {
            b: 1
        },
        key: "a"
    };

    expect(parcelShape.get('a').data).toEqual(expectedParcelData);
});

test('ParcelShapes.getIn should work with objects', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: {
                b: 1
            }
        }
    });

    let expectedParcelData = {
        value: 1,
        key: "b"
    };

    expect(parcelShape.getIn(['a','b']).data).toEqual(expectedParcelData);
});

test('ParcelShapes.getIn should work with objects with non-existent keys', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: {
                b: 1
            }
        }
    });

    let expectedParcelData = {
        value: undefined,
        key: "z"
    };

    expect(parcelShape.getIn(['z']).data).toEqual(expectedParcelData);
});

test('ParcelShapes.getIn should return undefined if asking through a non-parent', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: 1
        }
    });

    let expectedParcelData = {
        value: undefined,
        key: "b"
    };

    expect(parcelShape.getIn(['a', 'b']).data).toEqual(expectedParcelData);
});

test('ParcelShapes.size() should return size of parcel', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: 1,
            b: 4
        }
    });

    expect(parcelShape.size()).toBe(2);
});

test('ParcelShapes.has(key) should return a boolean indicating if key exists', () => {
    let parcelShape = ParcelShape.fromData({
        value: {
            a: 1,
            b: 4
        }
    });

    expect(parcelShape.has('a')).toBe(true);
    expect(parcelShape.has('z')).toBe(false);
});

test('ParcelShapes.children() should make a parent data type full of parcelShapes', () => {
    let children = ParcelShape.fromData({
        value: {a:1,b:2,c:3}
    })
        .children();

    expect(map(ii => ii.value)(children)).toEqual({a:1,b:2,c:3});
});

test('ParcelShapes.toObject() should make an object', () => {
    let parcelShape = ParcelShape.fromData({
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    });

    var expectedValue = {a:1,b:2,c:3};
    expect(map(ii => ii.value)(parcelShape.toObject())).toEqual(expectedValue);
});

test('ParcelShapes.toArray() should make an array', () => {
    let parcelShape = ParcelShape.fromData({
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    });

    var expectedValue = [1,2,3];
    expect(map(ii => ii.value)(parcelShape.toArray())).toEqual(expectedValue);
});
