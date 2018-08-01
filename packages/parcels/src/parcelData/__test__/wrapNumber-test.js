// @flow
import test from 'ava';
import wrapNumber from '../wrapNumber';

test('wrapNumber passes through values where min <= value < max', t => {
    t.is(wrapNumber(0, 10), 0);
    t.is(wrapNumber(3, 10), 3);
    t.is(wrapNumber(6, 7), 6);
});

test('wrapNumber wraps values equal to or higher than max', t => {
    t.is(wrapNumber(10, 10), 0);
    t.is(wrapNumber(13, 10), 3);
    t.is(wrapNumber(103, 10), 3);
});

test('wrapNumber wraps values smaller than min', t => {
    t.is(wrapNumber(-1, 10), 9);
    t.is(wrapNumber(-2, 10), 8);
    t.is(wrapNumber(-32, 10), 8);
});
