// @flow
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import Parcel from '../../parcel/Parcel';
import TestTimeExecution from '../../util/__test__/TestTimeExecution-testUtil';
import range from 'unmutable/lib/util/range';

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
        type: "set",
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
        .nextData;

    var expectedValue = {
        a: 1,
        b: 3
    };

    expect(expectedValue).toEqual(value);
});

test('ChangeRequest prevData should return previous data', () => {
    var action = new Action({
        type: "set",
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

    let amount = 1000;

    let actions = range(amount).map((num) => new Action({
        type: "set",
        keyPath: ["a","b","c","d","e"],
        payload: num
    }));

    var parcel = new Parcel({
        value: {
            a: {
                b: {
                    c: {
                        d: {
                            e: 123
                        }
                    }
                }
            }
        }
    });

    let changeRequest = new ChangeRequest(actions)._create({
        prevData: parcel.data
    });
    let data;

    let ms = TestTimeExecution(() => {
        data = changeRequest.nextData;
    });

    var expectedData = {
        value: {
            a: {
                b: {
                    c: {
                        d: {
                            e: amount - 1
                        }
                    }
                }
            }
        },
        key: "^",
        meta: {},
        child: {
            a: {
                key: "a",
                child: {
                    b: {
                        key: "b",
                        child: {
                            c: {
                                key: "c",
                                child: {
                                    d: {
                                        key: "d",
                                        child: {
                                            e: {
                                                key: "e"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    expect(expectedData).toEqual(data);

    let ms2 = TestTimeExecution(() => {
        data = changeRequest.nextData;
    });

    expect(expectedData).toEqual(data);

    expect(ms2).toBeLessThan(ms / 100); // expect amazing performance boosts from having cached
});

test('ChangeRequest getDataIn should return previous and next value at keyPath', () => {
    var action = new Action({
        type: "set",
        keyPath: ["a", "c", "#a"],
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });
    let {next, prev} = basedChangeRequest.getDataIn(['a', 'c', '#a']);

    expect(next.value).toBe(100);
    expect(prev.value).toBe(0);
});

test('ChangeRequest hasValueChanged should indicate if value changed at path', () => {
    var action = new Action({
        type: "set",
        keyPath: ["a", "c", "#a"],
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasValueChanged(['a', 'c', '#a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'c', '#b'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['a', 'c'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'd'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['b'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['e'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged()).toBe(true);
});

test('ChangeRequest hasValueChanged should indicate if value changed at path due to deletion', () => {
    var action = new Action({
        type: "delete",
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasValueChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'b'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['b'])).toBe(false);
});

test('ChangeRequest hasValueChanged should indicate if value changed in array, identifying elements by key', () => {
    var action = new Action({
        type: "insertBefore",
        keyPath: ["#b"],
        payload: 999
    });

    var parcel = new Parcel({
        value: [0,1,2,3]
    });

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasValueChanged(['#a'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#b'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#c'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#d'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#e'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if value changed at path', () => {
    var action = new Action({
        type: "set",
        keyPath: ["a", "c", "#a"],
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasDataChanged(['a', 'c', '#a'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['a', 'c', '#b'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['a', 'c'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['a', 'd'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['b'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['e'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if meta changed at path', () => {
    var action = new Action({
        type: "setMeta",
        keyPath: ["a", "c", "#a"],
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasDataChanged(['a', 'c', '#a'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['a', 'c', '#b'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['a', 'c'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['a', 'd'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['b'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['e'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged()).toBe(true);
});

test('ChangeRequest hasDataChanged should indicate if value changed at path due to deletion', () => {
    var action = new Action({
        type: "delete",
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

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasDataChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['a', 'b'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged(['b'])).toBe(false);
});

test('ChangeRequest hasDataChanged should indicate if value changed in array, identifying elements by key', () => {
    var action = new Action({
        type: "insertBefore",
        keyPath: ["#b"],
        payload: 999
    });

    var parcel = new Parcel({
        value: [0,1,2,3]
    });

    let basedChangeRequest = new ChangeRequest(action)._create({
        prevData: parcel.data
    });

    expect(basedChangeRequest.hasDataChanged(['#a'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['#b'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['#c'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['#d'])).toBe(false);
    expect(basedChangeRequest.hasDataChanged(['#e'])).toBe(true);
    expect(basedChangeRequest.hasDataChanged()).toBe(true);
});

test('ChangeRequest squash should merge actions and squash it into a single action', () => {

    let actions = [
        new ChangeRequest(new Action({type: "???", keyPath: ['a']})),
        new ChangeRequest(new Action({type: "!!!", keyPath: ['a']})),
        new ChangeRequest(new Action({type: "...", keyPath: ['b']})),
    ];

    let squashed = ChangeRequest.squash(actions);

    expect(squashed.actions.length).toBe(1);
    expect(squashed.actions[0].type).toBe('batch');
    expect(squashed.actions[0].payload.length).toBe(3);
});


test('ChangeRequest squash should merge 0 actions', () => {

    let squashed = ChangeRequest.squash([]);

    expect(squashed.actions.length).toBe(0);
});

