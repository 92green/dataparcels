// @flow
import StaticParcel from '../StaticParcel';

import map from 'unmutable/lib/map';

test('StaticParcels getters should work', () => {
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

    let parcel = StaticParcel.fromData(data);
    expect(parcel.meta).toEqual(data.meta);
    expect(parcel.key).toEqual(data.key);
});

test('StaticParcels.get should work with objects', () => {
    let staticParcel = StaticParcel.fromData({
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

    expect(staticParcel.get('a').data).toEqual(expectedParcelData);
});

test('StaticParcels.getIn should work with objects', () => {
    let staticParcel = StaticParcel.fromData({
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

    expect(staticParcel.getIn(['a','b']).data).toEqual(expectedParcelData);
});

test('StaticParcels.getIn should work with objects with non-existent keys', () => {
    let staticParcel = StaticParcel.fromData({
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

    expect(staticParcel.getIn(['z']).data).toEqual(expectedParcelData);
});

test('StaticParcels.getIn should return undefined if asking through a non-parent', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1
        }
    });

    let expectedParcelData = {
        value: undefined,
        key: "b"
    };

    expect(staticParcel.getIn(['a', 'b']).data).toEqual(expectedParcelData);
});

test('StaticParcels.size() should return size of parcel', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        }
    });

    expect(staticParcel.size()).toBe(2);
});

test('StaticParcels.has(key) should return a boolean indicating if key exists', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        }
    });

    expect(staticParcel.has('a')).toBe(true);
    expect(staticParcel.has('z')).toBe(false);
});

test('StaticParcels.children() should make a parent data type full of static parcels', () => {
    let children = StaticParcel.fromData({
        value: {a:1,b:2,c:3}
    })
        .children();

    expect(map(ii => ii.value)(children)).toEqual({a:1,b:2,c:3});
});

test('StaticParcels.toObject() should make an object', () => {
    let staticParcel = StaticParcel.fromData({
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    });

    var expectedValue = {a:1,b:2,c:3};
    expect(map(ii => ii.value)(staticParcel.toObject())).toEqual(expectedValue);
});

test('StaticParcels.toArray() should make an array', () => {
    let staticParcel = StaticParcel.fromData({
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    });

    var expectedValue = [1,2,3];
    expect(map(ii => ii.value)(staticParcel.toArray())).toEqual(expectedValue);
});
