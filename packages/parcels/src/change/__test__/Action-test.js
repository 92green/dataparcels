// @flow
import Action from '../Action';

test('Action should build an action', () => {
    let expectedDefaultData = {
        type: "",
        payload: {},
        keyPath: []
    };
    expect(expectedDefaultData).toEqual(new Action().toJS());
});

test('Action should build an action with a type', () => {
    expect("???").toBe(new Action({type: "???"}).type);
});

test('Action should build an action with a payload', () => {
    expect({a: 1}).toEqual(new Action({type: "???", payload: {a: 1}}).payload);
});

test('Action should build an action with a default payload', () => {
    expect({}).toEqual(new Action({type: "???"}).payload);
});

test('Action should build an action with a keyPath', () => {
    expect(['a', 'b']).toEqual(new Action({type: "???", keyPath: ['a', 'b']}).keyPath);
});

test('Action should build an action with a default keyPath', () => {
    expect([]).toEqual(new Action({type: "???"}).keyPath);
});

test('Action should be synchronous if it has a type of ping, else not', () => {
    expect(new Action({type: "ping"}).shouldBeSynchronous()).toBe(true);
    expect(new Action({type: "set"}).shouldBeSynchronous()).toBe(false);
    expect(new Action({type: "???"}).shouldBeSynchronous()).toBe(false);
});

test('Action should unshift key to front of keyPath when ungetting', () => {
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

    expect(expectedAction).toEqual(new Action(action)._unget('b').toJS());
});

test('Action should be value action if it isnt ping or setMeta', () => {
    expect(new Action({type: "ping"}).isValueAction()).toBe(false);
    expect(new Action({type: "set"}).isValueAction()).toBe(true);
    expect(new Action({type: "setMeta"}).isValueAction()).toBe(false);
});

test('Action should be meta action if it is setMeta', () => {
    expect(new Action({type: "ping"}).isMetaAction()).toBe(false);
    expect(new Action({type: "set"}).isMetaAction()).toBe(false);
    expect(new Action({type: "setMeta"}).isMetaAction()).toBe(true);
});
