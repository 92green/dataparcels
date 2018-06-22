// @flow
import test from 'ava';
import wrapNumber from '../wrapNumber';

test('wrapNumber passes through values where min <= value < max', tt => {
    tt.is(wrapNumber(0, 10), 0);
    tt.is(wrapNumber(3, 10), 3);
    tt.is(wrapNumber(6, 7), 6);
});

test('wrapNumber wraps values equal to or higher than max', tt => {
    tt.is(wrapNumber(10, 10), 0);
    tt.is(wrapNumber(13, 10), 3);
    tt.is(wrapNumber(103, 10), 3);
});

test('wrapNumber wraps values smaller than min', tt => {
    tt.is(wrapNumber(-1, 10), 9);
    tt.is(wrapNumber(-2, 10), 8);
    tt.is(wrapNumber(-32, 10), 8);
});
