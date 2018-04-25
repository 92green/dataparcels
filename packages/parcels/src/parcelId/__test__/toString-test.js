// @flow
import test from 'ava';
import toString from '../toString';

const STRING_ID = "_.abc.def";
const ARRAY_ID = ["_","abc","def"];

test('toString should turn ids into arrays', tt => {
    tt.deepEqual(STRING_ID, toString()(STRING_ID), `toString() should pass through strings`);
    tt.deepEqual(STRING_ID, toString()(ARRAY_ID), `toString() should convert arrays`);
});
