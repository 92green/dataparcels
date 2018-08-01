// @flow
import test from 'ava';
import forEach from '../forEach';

test('forEach should work on objects', (t: Object) => {
    let parcelData = {
        value: {a:1,b:2,c:3}
    };

    let expectedArr = [
        {
            parcelData: {
                value: 1,
                key: "a",
                meta: {}
            },
            key: "a"
        },
        {
            parcelData: {
                value: 2,
                key: "b",
                meta: {}
            },
            key: "b"
        },
        {
            parcelData: {
                value: 3,
                key: "c",
                meta: {}
            },
            key: "c"
        }
    ];

    let arr = [];
    forEach((parcelData, key) => arr.push({parcelData, key}))(parcelData);

    t.deepEqual(expectedArr, arr);
});

test('forEach should work on arrays', (t: Object) => {
    let parcelData = {
        value: [1,2,3]
    };

    let expectedArr = [
        {
            parcelData: {
                value: 1,
                key: "#a",
                meta: {}
            },
            key: 0
        },
        {
            parcelData: {
                value: 2,
                key: "#b",
                meta: {}
            },
            key: 1
        },
        {
            parcelData: {
                value: 3,
                key: "#c",
                meta: {}
            },
            key: 2
        }
    ];

    let arr = [];
    forEach((parcelData, key) => arr.push({parcelData, key}))(parcelData);

    t.deepEqual(expectedArr, arr);
});
