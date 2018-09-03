// @flow
import keyOrIndexToIndex from '../keyOrIndexToIndex';

test('keyOrIndexToIndex() accepts index and returns index for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect(0).toBe(keyOrIndexToIndex(0)(data));
});

test('keyOrIndexToIndex() accepts key and returns index for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect(0).toBe(keyOrIndexToIndex("#a")(data));
});

test('keyOrIndexToIndex() accepts non existent key and returns undefined', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect(undefined).toBe(keyOrIndexToIndex("#z")(data));
});

test('keyOrIndexToIndex() throws error for object', () => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    expect(() => keyOrIndexToIndex("a")(data)).toThrow(/^Cannot find index on non-indexed parcelData$/);
});
