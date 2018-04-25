// @flow
import test from 'ava';
import {toString26, toInt26} from '../convert26';

test('toString26 should work properly', tt => {
    tt.is(toString26(0), "");
    tt.is(toString26(1), "a");
    tt.is(toString26(2), "b");
    tt.is(toString26(26), "z");
    tt.is(toString26(27), "aa");
    tt.is(toString26(54), "bb");
});

test('toInt26 should work properly', tt => {
    tt.is(toInt26("a"), 1);
    tt.is(toInt26("b"), 2);
    tt.is(toInt26("z"), 26);
    tt.is(toInt26("aa"), 27);
    tt.is(toInt26("bb"), 54);
});
