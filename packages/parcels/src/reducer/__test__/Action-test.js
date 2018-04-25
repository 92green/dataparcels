// @flow
import test from 'ava';
import Action from '../Action';

test('Action should build an action with a type', tt => {
    tt.is("???", new Action({type: "???"}).type);
});

test('Action should build an action with a payload', tt => {
    tt.deepEqual({a: 1}, new Action({type: "???", payload: {a: 1}}).payload);
});

test('Action should build an action with a default payload', tt => {
    tt.deepEqual({}, new Action({type: "???"}).payload);
});
test('Action should build an action with a keyPath', tt => {
    tt.deepEqual(['a', 'b'], new Action({type: "???", keyPath: ['a', 'b']}).keyPath);
});

test('Action should build an action with a default keyPath', tt => {
    tt.deepEqual([], new Action({type: "???"}).keyPath);
});
