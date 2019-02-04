// @flow
import update from '../update';

const addThree = (parcelData) => ({
    ...parcelData,
    value: parcelData.value + 3
});

test('update should work', () => {
    let parcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a", meta: {abc: 123}},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {a:15,b:2,c:3},
        child: {
            a: {key:"a", meta: {abc: 123}},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedExisting = {
        value: 1,
        meta: {abc: 123},
        key: "a"
    };

    let updated = update('a', (existing) => {
        expect(existing).toEqual(expectedExisting);
        return {
            ...existing,
            value: existing.value + 14
        };
    })(parcelData);

    expect(updated).toEqual(expectedParcelData);
});

test('update should work with unkeyed arrays', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let expectedParcelData = {
        value: [1,2,6],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    let expectedExisting = {
        value: 3,
        key: "#c"
    };

    let updated = update('#c', (existing) => {
        expect(existing).toEqual(expectedExisting);
        return {
            ...existing,
            value: 6
        };
    })(parcelData);

    expect(updated).toEqual(expectedParcelData);
});
