// @flow
import test from 'ava';
import filterModifiers from '../filterModifiers';

const STRING_ID = "_.abc.def.&thing&";
const ARRAY_ID = ["_","abc","&thing&","def"];

test('filterModifiers should filterModifiers', tt => {
    tt.deepEqual("_.abc.def", filterModifiers()(STRING_ID), `filterModifiers() should filterModifiers strings`);
    tt.deepEqual(["_","abc","def"], filterModifiers()(ARRAY_ID), `filterModifiers() should filterModifiers arrays`);
});
