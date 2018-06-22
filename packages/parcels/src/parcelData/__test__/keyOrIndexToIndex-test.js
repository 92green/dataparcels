// @flow
import test from 'ava';
import keyOrIndexToIndex from '../keyOrIndexToIndex';

test('keyOrIndexToIndex() accepts index and returns index for array', tt => {
    let data = {
        value: [
            1,
            2
        ]
    };

    tt.is(0, keyOrIndexToIndex(0)(data));
});

test('keyOrIndexToIndex() accepts key and returns index for array', tt => {
    let data = {
        value: [
            1,
            2
        ]
    };

    tt.is(0, keyOrIndexToIndex("#a")(data));
});


test('keyOrIndexToIndex() throws error for object', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    tt.is(`Cannot find index on non-indexed parcelData`, tt.throws(() => keyOrIndexToIndex("a")(data), Error).message);
});
