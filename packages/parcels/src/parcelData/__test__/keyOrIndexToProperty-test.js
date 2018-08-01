// @flow
import test from 'ava';
import keyOrIndexToProperty from '../keyOrIndexToProperty';

test('keyOrIndexToProperty() accepts key and returns property for object', t => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    t.is("a", keyOrIndexToProperty("a")(data));
});

test('keyOrIndexToProperty() accepts index and returns property for array', t => {
    let data = {
        value: [
            1,
            2
        ]
    };

    t.is(0, keyOrIndexToProperty(0)(data));
});

test('keyOrIndexToProperty() accepts key and returns property for array', t => {
    let data = {
        value: [
            1,
            2
        ]
    };

    t.is(0, keyOrIndexToProperty("#a")(data));
});

