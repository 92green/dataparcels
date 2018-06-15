// @flow
import test from 'ava';
import Action from '../Action';

test('Action should build an action', tt => {
    let expectedDefaultData = {
        type: "",
        payload: {},
        keyPath: []
    };
    tt.deepEqual(expectedDefaultData, new Action().toJS());
});

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

test('Action should be synchronous if it has a type of ping, else not', tt => {
    tt.true(new Action({type: "ping"}).shouldBeSynchronous());
    tt.false(new Action({type: "set"}).shouldBeSynchronous());
    tt.false(new Action({type: "???"}).shouldBeSynchronous());
});

test('Action should unshift key to front of keyPath when ungetting', tt => {
    let action = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['a']
    };

    let expectedAction = {
        type: "woo",
        payload: {abc: 123},
        keyPath: ['b', 'a']
    };

    tt.deepEqual(expectedAction, new Action(action)._unget('b').toJS());
});

test('Action should be value action if it isnt ping or setMeta', tt => {
    tt.false(new Action({type: "ping"}).isValueAction());
    tt.true(new Action({type: "set"}).isValueAction());
    tt.false(new Action({type: "setMeta"}).isValueAction());
});

test('Action should be meta action if it is setMeta', tt => {
    tt.false(new Action({type: "ping"}).isMetaAction());
    tt.false(new Action({type: "set"}).isMetaAction());
    tt.true(new Action({type: "setMeta"}).isMetaAction());
});
