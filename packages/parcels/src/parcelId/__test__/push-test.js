// @flow
import test from 'ava';
import push from '../push';

const STRING_ID = "_.abc.def";
const ARRAY_ID = ["_","abc","def"];

test('push should push', tt => {
    tt.deepEqual("_.abc.def.ghi", push("ghi")(STRING_ID), `push() should push strings`);
});
