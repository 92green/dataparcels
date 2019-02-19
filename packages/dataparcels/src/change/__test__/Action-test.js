// @flow
import Action from '../Action';

test('Action should build an action', () => {
    let expectedDefaultData = {
        type: "",
        payload: {},
        keyPath: [],
        steps: []
    };
    expect(new Action().toJS()).toEqual(expectedDefaultData);
});

test('Action should build an action with a type', () => {
    expect(new Action({type: "???"}).type).toBe("???");
});

test('Action should build an action with a payload', () => {
    expect(new Action({type: "???", payload: {a: 1}}).payload).toEqual({a: 1});
});

test('Action should build an action with a default payload', () => {
    expect(new Action({type: "???"}).payload).toEqual({});
});

test('Action should build an action with a keyPath', () => {
    expect(new Action({type: "???", keyPath: ['a', 'b']}).keyPath).toEqual(['a', 'b']);
});

test('Action should build an action with a default keyPath', () => {
    expect(new Action({type: "???"}).keyPath).toEqual([]);
});

test('Action should be value action if it isnt setMeta', () => {
    expect(new Action({type: "set"}).isValueAction()).toBe(true);
    expect(new Action({type: "setMeta"}).isValueAction()).toBe(false);
});

test('Action should be meta action if it is setMeta', () => {
    expect(new Action({type: "set"}).isMetaAction()).toBe(false);
    expect(new Action({type: "setMeta"}).isMetaAction()).toBe(true);
});
