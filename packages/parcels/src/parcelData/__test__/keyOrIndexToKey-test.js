// @flow
import keyOrIndexToKey from '../keyOrIndexToKey';

test('keyOrIndexToKey() accepts key and returns key for object', () => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    expect("a").toBe(keyOrIndexToKey("a")(data));
});

test('keyOrIndexToKey() accepts index and returns key for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect("#a").toBe(keyOrIndexToKey(0)(data));
});

test('keyOrIndexToKey() accepts key and returns key for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect("#a").toBe(keyOrIndexToKey("#a")(data));
});

