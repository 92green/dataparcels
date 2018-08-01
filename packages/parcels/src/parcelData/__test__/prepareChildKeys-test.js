// @flow
import test from 'ava';
import prepareChildKeys from '../prepareChildKeys';

test('prepareChildKeys() adds child keys if they dont exist', t => {
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

    t.deepEqual(expectedData, prepareChildKeys()(data));
});

test('prepareChildKeys() doesnt change anything if child keys all exist', t => {
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

    t.deepEqual(data, prepareChildKeys()(data));
});
