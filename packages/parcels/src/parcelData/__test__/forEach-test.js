// @flow
import test from 'ava';
import forEach from '../forEach';

test('forEach should work on objects', (tt: Object) => {
    let parcelData = {
        value: {a:1,b:2,c:3}
    };

    let expectedArr = [
        {
            parcelData: {
                value: 1,
                key: "a"
            },
            key: "a"
        },
        {
            parcelData: {
                value: 2,
                key: "b"
            },
            key: "b"
        },
        {
            parcelData: {
                value: 3,
                key: "c"
            },
            key: "c"
        }
    ];

    let arr = [];
    forEach((parcelData, key) => arr.push({parcelData, key}))(parcelData);

    tt.deepEqual(expectedArr, arr);
});

test('forEach should work on arrays', (tt: Object) => {
    let parcelData = {
        value: [1,2,3]
    };

    let expectedArr = [
        {
            parcelData: {
                value: 1,
                key: "#a"
            },
            key: 0
        },
        {
            parcelData: {
                value: 2,
                key: "#b"
            },
            key: 1
        },
        {
            parcelData: {
                value: 3,
                key: "#c"
            },
            key: 2
        }
    ];

    let arr = [];
    forEach((parcelData, key) => arr.push({parcelData, key}))(parcelData);

    tt.deepEqual(expectedArr, arr);
});
