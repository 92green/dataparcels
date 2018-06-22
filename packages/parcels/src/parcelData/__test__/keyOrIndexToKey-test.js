// @flow
import test from 'ava';
import keyOrIndexToKey from '../keyOrIndexToKey';

test('keyOrIndexToKey() accepts key and returns key for object', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    tt.is("a", keyOrIndexToKey("a")(data));
});

test('keyOrIndexToKey() accepts index and returns key for array', tt => {
    let data = {
        value: [
            1,
            2
        ]
    };

    tt.is("#a", keyOrIndexToKey(0)(data));
});

test('keyOrIndexToKey() accepts key and returns key for array', tt => {
    let data = {
        value: [
            1,
            2
        ]
    };

    tt.is("#a", keyOrIndexToKey("#a")(data));
});

