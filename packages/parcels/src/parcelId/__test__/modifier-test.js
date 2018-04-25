// @flow
import test from 'ava';
import modifier from '../modifier';

test('modifier should make a modifier', tt => {
    tt.deepEqual("&thing&", modifier("thing"), `modifier() should make a modifier`);
    tt.deepEqual("&thing&key", modifier("thing", "key"), `modifier() should make a modifier with a key`);
});
