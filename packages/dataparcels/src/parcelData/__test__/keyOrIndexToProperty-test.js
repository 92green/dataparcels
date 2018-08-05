// @flow
import keyOrIndexToProperty from '../keyOrIndexToProperty';

test('keyOrIndexToProperty() accepts key and returns property for object', () => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    expect("a").toBe(keyOrIndexToProperty("a")(data));
});

test('keyOrIndexToProperty() accepts index and returns property for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect(0).toBe(keyOrIndexToProperty(0)(data));
});

test('keyOrIndexToProperty() accepts key and returns property for array', () => {
    let data = {
        value: [
            1,
            2
        ]
    };

    expect(0).toBe(keyOrIndexToProperty("#a")(data));
});

