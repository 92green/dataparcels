// @flow
import prepareChildKeys from '../prepareChildKeys';

test('prepareChildKeys() adds child keys if they dont exist', () => {
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

    expect(expectedData).toEqual(prepareChildKeys()(data));
});

test('prepareChildKeys() doesnt change anything if child keys all exist', () => {
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

    expect(data).toEqual(prepareChildKeys()(data));
});
