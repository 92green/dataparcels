// @flow
import test from 'ava';
import stripParcelData from '../stripParcelData';

test('stripParcelData should pass through value', tt => {
    tt.deepEqual(
        stripParcelData({
            value: 123
        }),
        {
            value: 123
        }
    );
});

test('stripParcelData should remove empty child', tt => {
    tt.deepEqual(
        stripParcelData({
            value: 123,
            child: []
        }),
        {
            value: 123
        }
    );
});

test('stripParcelData should remove undefined child', tt => {
    tt.deepEqual(
        stripParcelData({
            value: 123,
            child: undefined
        }),
        {
            value: 123
        }
    );
});

test('stripParcelData should remove undefined key', tt => {
    tt.deepEqual(
        stripParcelData({
            value: 123,
            key: undefined
        }),
        {
            value: 123
        }
    );
});

