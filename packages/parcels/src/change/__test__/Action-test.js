// @flow
import test from 'ava';
import Action from '../Action';

test('Action should build an action', t => {
    let expectedDefaultData = {
        type: "",
        payload: {},
        keyPath: []
    };
    t.deepEqual(expectedDefaultData, new Action().toJS());
});

test('Action should build an action with a type', t => {
    t.is("???", new Action({type: "???"}).type);
});

test('Action should build an action with a payload', t => {
    t.deepEqual({a: 1}, new Action({type: "???", payload: {a: 1}}).payload);
});

test('Action should build an action with a default payload', t => {
    t.deepEqual({}, new Action({type: "???"}).payload);
});

test('Action should build an action with a keyPath', t => {
    t.deepEqual(['a', 'b'], new Action({type: "???", keyPath: ['a', 'b']}).keyPath);
});

test('Action should build an action with a default keyPath', t => {
    t.deepEqual([], new Action({type: "???"}).keyPath);
});

test('Action should be synchronous if it has a type of ping, else not', t => {
    t.true(new Action({type: "ping"}).shouldBeSynchronous());
    t.false(new Action({type: "set"}).shouldBeSynchronous());
    t.false(new Action({type: "???"}).shouldBeSynchronous());
});

test('Action should unshift key to front of keyPath when ungetting', t => {
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

    t.deepEqual(expectedAction, new Action(action)._unget('b').toJS());
});

test('Action should be value action if it isnt ping or setMeta', t => {
    t.false(new Action({type: "ping"}).isValueAction());
    t.true(new Action({type: "set"}).isValueAction());
    t.false(new Action({type: "setMeta"}).isValueAction());
});

test('Action should be meta action if it is setMeta', t => {
    t.false(new Action({type: "ping"}).isMetaAction());
    t.false(new Action({type: "set"}).isMetaAction());
    t.true(new Action({type: "setMeta"}).isMetaAction());
});
