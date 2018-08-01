// @flow
import test from 'ava';
import keyOrIndexToIndex from '../keyOrIndexToIndex';

test('keyOrIndexToIndex() accepts index and returns index for array', t => {
    let data = {
        value: [
            1,
            2
        ]
    };

    t.is(0, keyOrIndexToIndex(0)(data));
});

test('keyOrIndexToIndex() accepts key and returns index for array', t => {
    let data = {
        value: [
            1,
            2
        ]
    };

    t.is(0, keyOrIndexToIndex("#a")(data));
});

test('keyOrIndexToIndex() accepts non existent key and returns undefined', t => {
    let data = {
        value: [
            1,
            2
        ]
    };

    t.is(undefined, keyOrIndexToIndex("#z")(data));
});

test('keyOrIndexToIndex() throws error for object', t => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    t.is(`Cannot find index on non-indexed parcelData`, t.throws(() => keyOrIndexToIndex("a")(data), Error).message);
});
