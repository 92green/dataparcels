// @flow
import Action from '../Action';

test('Action should build an action', () => {
    expect(new Action().type).toEqual("");
    expect(new Action().payload).toEqual(undefined);
    expect(new Action().keyPath).toEqual([]);
    expect(new Action().steps).toEqual([]);
});

test('Action should build an action with a type', () => {
    expect(new Action({type: "???"}).type).toBe("???");
});

test('Action should build an action with a payload', () => {
    expect(new Action({type: "???", payload: 1}).payload).toEqual(1);
});

test('Action should build an action with a default payload', () => {
    expect(new Action({type: "???"}).payload).toEqual(undefined);
});

test('Action should build an action with a keyPath', () => {
    expect(new Action({type: "???", keyPath: ['a', 'b']}).keyPath).toEqual(['a', 'b']);
});

test('Action should build an action with a default keyPath', () => {
    expect(new Action({type: "???"}).keyPath).toEqual([]);
});
