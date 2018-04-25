// @flow
import test from 'ava';
import toArray from '../toArray';

const STRING_ID = "_.abc.def";
const ARRAY_ID = ["_","abc","def"];

test('toArray should turn ids into arrays', tt => {
    tt.deepEqual(ARRAY_ID, toArray()(ARRAY_ID), `toArray() should pass through arrays`);
    tt.deepEqual(ARRAY_ID, toArray()(STRING_ID), `toArray() should convert strings`);
});
