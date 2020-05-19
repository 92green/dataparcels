// @flow
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import Parcel from '../../parcel/Parcel';
import TypeSet from '../../typeHandlers/TypeSet';
import ActionReducer from '../ActionReducer';
const typeSet = new TypeSet(TypeSet.defaultTypes);

test('ChangeRequest should build an action', () => {
    expect(new ChangeRequest().actions).toEqual([]);
    expect(new ChangeRequest().originId).toEqual(null);
    expect(new ChangeRequest().originPath).toEqual(null);
});

test('ChangeRequest actions should get actions', () => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    expect(actions).toEqual(new ChangeRequest(actions).actions);
});

test('ChangeRequest merge() should merge other change requests actions', () => {
    let actionsA = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    let actionsB = [
        new Action({type: "aaa", keyPath: ['b']}),
        new Action({type: "bbb", keyPath: ['b']})
    ];

    let a = new ChangeRequest(actionsA);
    let b = new ChangeRequest(actionsB);

    let merged = a.merge(b);

    expect([...actionsA, ...actionsB]).toEqual(merged.actions);
});

test('ChangeRequest nextData() and data should use Reducer', () => {

    var action = new Action({
        type: "basic.set",
        keyPath: ["b"],
        payload: 3
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = jest.fn(() => ({value: 123}));
    cr = cr._create({
        prevData: parcel.data
    });

    let {value} = cr.nextData;

    expect(cr._actionReducer).toHaveBeenCalledTimes(1);
    expect(value).toEqual(123);
});

test('ChangeRequest prevData should return previous data', () => {
    var action = new Action({
        type: "basic.set",
        keyPath: ["b"],
        payload: 3
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let {value} = new ChangeRequest(action)
        ._create({
            prevData: parcel.data
        })
        .prevData;

    var expectedValue = {
        a: 1,
        b: 2
    };

    expect(expectedValue).toEqual(value);
});

test('ChangeRequest should keep originId and originPath', () => {
    expect.assertions(2);

    var data = {
        value: {
            abc: 123
        },
        handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
            expect(['abc']).toEqual(changeRequest.originPath);
            expect('^.abc').toEqual(changeRequest.originId);
        }
    };

    new Parcel(data)
        .get('abc')
        .set(456);
});

test('ChangeRequest should cache its data after its calculated, so subsequent calls are faster', () => {

    var action = new Action({
        type: "basic.set",
        keyPath: ["b"],
        payload: 3
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = jest.fn(() => ({value: 123}));
    cr = cr._create({
        prevData: parcel.data
    });

    let {value} = cr.nextData;
    cr.nextData;
    cr.nextData;
    cr.nextData;

    expect(cr._actionReducer).toHaveBeenCalledTimes(1);
    expect(value).toEqual(123);
});

test('ChangeRequest getDataIn should return previous and next value at keyPath', () => {

    var action = new Action({
        type: "basic.set",
        keyPath: ["a", "c", "#0"],
        payload: 100
    });

    var parcel = new Parcel({
        value: {
            a: {
                c: [0,1],
                d: 2
            },
            b: 3
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    let {next, prev} = cr.getDataIn(['a', 'c', '#0']);

    expect(next.value).toBe(100);
    expect(prev.value).toBe(0);
});

test('ChangeRequest hasValueChanged should indicate if value changed at path', () => {
    var action = new Action({
        type: "basic.set",
        keyPath: ["a", "c", "#0"],
        payload: 100
    });

    var parcel = new Parcel({
        value: {
            a: {
                c: [0,1],
                d: 2
            },
            b: 3,
            e: NaN
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasValueChanged(['a', 'c', '#0'])).toBe(true);
    expect(cr.hasValueChanged(['a', 'c', '#1'])).toBe(false);
    expect(cr.hasValueChanged(['a', 'c'])).toBe(true);
    expect(cr.hasValueChanged(['a', 'd'])).toBe(false);
    expect(cr.hasValueChanged(['a'])).toBe(true);
    expect(cr.hasValueChanged(['b'])).toBe(false);
    expect(cr.hasValueChanged(['e'])).toBe(false);
    expect(cr.hasValueChanged()).toBe(true);
});

test('ChangeRequest hasValueChanged should indicate if value changed at path due to deletion', () => {
    var action = new Action({
        type: "object.child.delete",
        keyPath: ["a"]
    });

    var parcel = new Parcel({
        value: {
            a: {
                b: 100
            },
            b: 2
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasValueChanged(['a'])).toBe(true);
    expect(cr.hasValueChanged(['a', 'b'])).toBe(true);
    expect(cr.hasValueChanged(['b'])).toBe(false);
});

test('ChangeRequest hasValueChanged should indicate if value changed in array, identifying elements by key', () => {
    var action = new Action({
        type: "array.child.insert",
        keyPath: ["#1"],
        payload: {value: 999, offset: 0}
    });

    var parcel = new Parcel({
        value: [0,1,2,3]
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasValueChanged(['#0'])).toBe(false);
    expect(cr.hasValueChanged(['#1'])).toBe(false);
    expect(cr.hasValueChanged(['#2'])).toBe(false);
    expect(cr.hasValueChanged(['#3'])).toBe(false);
    expect(cr.hasValueChanged(['#4'])).toBe(true);
    expect(cr.hasValueChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if data changed at path', () => {
    var action = new Action({
        type: "basic.set",
        keyPath: ["a", "c", "#0"],
        payload: 100
    });

    var parcel = new Parcel({
        value: {
            a: {
                c: [0,1],
                d: 2
            },
            b: 3,
            e: NaN
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasDataChanged(['a', 'c', '#0'])).toBe(true);
    expect(cr.hasDataChanged(['a', 'c', '#1'])).toBe(false);
    expect(cr.hasDataChanged(['a', 'c'])).toBe(true);
    expect(cr.hasDataChanged(['a', 'd'])).toBe(false);
    expect(cr.hasDataChanged(['a'])).toBe(true);
    expect(cr.hasDataChanged(['b'])).toBe(false);
    expect(cr.hasDataChanged(['e'])).toBe(false);
    expect(cr.hasDataChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if meta changed at path', () => {
    var action = new Action({
        type: "basic.setMeta",
        keyPath: ["a", "c", "#0"],
        payload: {
            abc: 123
        }
    });

    var parcel = new Parcel({
        value: {
            a: {
                c: [0,1],
                d: 2
            },
            b: 3,
            e: NaN
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasDataChanged(['a', 'c', '#0'])).toBe(true);
    expect(cr.hasDataChanged(['a', 'c', '#1'])).toBe(false);
    expect(cr.hasDataChanged(['a', 'c'])).toBe(true);
    expect(cr.hasDataChanged(['a', 'd'])).toBe(false);
    expect(cr.hasDataChanged(['a'])).toBe(true);
    expect(cr.hasDataChanged(['b'])).toBe(false);
    expect(cr.hasDataChanged(['e'])).toBe(false);
    expect(cr.hasDataChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if value changed at path due to deletion', () => {
    var action = new Action({
        type: "object.child.delete",
        keyPath: ["a"]
    });

    var parcel = new Parcel({
        value: {
            a: {
                b: 100
            },
            b: 2
        }
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasDataChanged(['a'])).toBe(true);
    expect(cr.hasDataChanged(['a', 'b'])).toBe(true);
    expect(cr.hasDataChanged(['b'])).toBe(false);
});

test('ChangeRequest hasDataChanged should indicate if value changed in array, identifying elements by key', () => {
    var action = new Action({
        type: "array.child.insert",
        keyPath: ["#1"],
        payload: {value: 999, offset: 0}
    });

    var parcel = new Parcel({
        value: [0,1,2,3]
    });

    let cr = new ChangeRequest(action);
    cr._actionReducer = ActionReducer(typeSet);
    cr._typeSet = typeSet;
    cr = cr._create({
        prevData: parcel.data
    });

    expect(cr.hasDataChanged(['#0'])).toBe(false);
    expect(cr.hasDataChanged(['#1'])).toBe(false);
    expect(cr.hasDataChanged(['#2'])).toBe(false);
    expect(cr.hasDataChanged(['#3'])).toBe(false);
    expect(cr.hasDataChanged(['#4'])).toBe(true);
    expect(cr.hasDataChanged()).toBe(true);
});

test('ChangeRequest squash should merge actions and squash it into a single action', () => {

    let actions = [
        new ChangeRequest(new Action({type: "???", keyPath: ['a']})),
        new ChangeRequest(new Action({type: "!!!", keyPath: ['a']})),
        new ChangeRequest(new Action({type: "...", keyPath: ['b']})),
    ];

    let squashed = ChangeRequest.squash(actions);

    expect(squashed.actions.length).toBe(1);
    expect(squashed.actions[0].type).toBe('reducer.batch');
    expect(squashed.actions[0].payload.length).toBe(3);
});


test('ChangeRequest squash should merge 0 actions', () => {

    let squashed = ChangeRequest.squash([]);

    expect(squashed.actions.length).toBe(0);
});

