// @flow
import test from 'ava';
import prepareChildKeys from '../prepareChildKeys';

test('prepareChildKeys() adds child keys if they dont exist', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    let expectedData = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        },
        meta: {}
    };

    tt.deepEqual(expectedData, prepareChildKeys()(data));
});

test('prepareChildKeys() doesnt change anything if child keys all exist', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        },
        meta: {}
    };

    tt.deepEqual(data, prepareChildKeys()(data));
});
