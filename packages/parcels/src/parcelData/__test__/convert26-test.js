// @flow
import test from 'ava';
import {toString26, toInt26} from '../convert26';

test('toString26 should work properly', t => {
    t.is(toString26(0), "");
    t.is(toString26(1), "a");
    t.is(toString26(2), "b");
    t.is(toString26(26), "z");
    t.is(toString26(27), "aa");
    t.is(toString26(54), "bb");
});

test('toInt26 should work properly', t => {
    t.is(toInt26("a"), 1);
    t.is(toInt26("b"), 2);
    t.is(toInt26("z"), 26);
    t.is(toInt26("aa"), 27);
    t.is(toInt26("bb"), 54);
});
