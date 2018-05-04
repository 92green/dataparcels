// @flow
import test from 'ava';
import strip from '../strip';

test('strip should pass through value', tt => {
    tt.deepEqual(
        strip()({
            value: 123
        }),
        {
            value: 123
        }
    );
});

test('strip should remove empty child', tt => {
    tt.deepEqual(
        strip()({
            value: 123,
            child: []
        }),
        {
            value: 123
        }
    );
});

test('strip should remove undefined child', tt => {
    tt.deepEqual(
        strip()({
            value: 123,
            child: undefined
        }),
        {
            value: 123
        }
    );
});

test('strip should remove undefined key', tt => {
    tt.deepEqual(
        strip()({
            value: 123,
            key: undefined
        }),
        {
            value: 123
        }
    );
});

test('strip should remove empty meta', tt => {
    tt.deepEqual(
        strip()({
            value: 123,
            meta: {}
        }),
        {
            value: 123
        }
    );
});

test('strip should remove undefined meta', tt => {
    tt.deepEqual(
        strip()({
            value: 123,
            meta: undefined
        }),
        {
            value: 123
        }
    );
});
