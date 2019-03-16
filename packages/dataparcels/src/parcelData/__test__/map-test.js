// @flow
import map from '../map';

test('map should work with objects', () => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key: "#a", meta: {a: 1}},
            {key: "#b", meta: {a: 11}},
            {key: "#c", meta: {a: 111}}
        ],
        meta: {b: 14}
    };

    let mapped = map((parcelData) => ({
        value: parcelData.value * 2,
        meta: {
            a: parcelData.meta.a * 2
        }
    }))(parcelData);

    let expectedMapped = {
        value: [2,4,6],
        child: [
            {key: "#a", meta: {a: 2}},
            {key: "#b", meta: {a: 22}},
            {key: "#c", meta: {a: 222}}
        ],
        meta: {b: 14}
    };

    expect(mapped).toEqual(expectedMapped);
});
