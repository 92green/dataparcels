// @flow
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import Parcel from '../../parcel/Parcel';
import TestTimeExecution from '../../util/__test__/TestTimeExecution-testUtil';
import range from 'unmutable/lib/util/range';

test('ChangeRequest should build an action', () => {
    let expectedDefaultData = {
        actions: [],
        meta: {},
        originId: null,
        originPath: null,
    };
    expect(expectedDefaultData).toEqual(new ChangeRequest().toJS());
});

test('ChangeRequest actions() should get actions', () => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    expect(actions).toEqual(new ChangeRequest(actions).actions());
});

test('ChangeRequest updateActions() should update actions', () => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    expect([actions[0]]).toEqual(new ChangeRequest(actions)
        .updateActions(actions => actions.filter(aa => aa.type === "???"))
        .actions());
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

    expect([...actionsA, ...actionsB]).toEqual(merged.actions());
});


test('ChangeRequest setChangeRequestMeta() and changeRequestMeta should work', () => {
    let expectedMeta = {
        a: 3,
        b: 2
    };
    expect(expectedMeta).toEqual(new ChangeRequest()
        .setChangeRequestMeta({a: 1})
        .setChangeRequestMeta({b: 2})
        .setChangeRequestMeta({a: 3})
        .changeRequestMeta);
});

test('ChangeRequest _unget() should prepend key', () => {
    let actions = [
        new Action({type: "???", keyPath: ['a']}),
        new Action({type: "!!!", keyPath: ['a']})
    ];

    let expectedKeyPaths = [
        ['b', 'a'],
        ['b', 'a']
    ];

    expect(expectedKeyPaths).toEqual(new ChangeRequest(actions)
        ._unget('b')
        .actions()
        .map(aa => aa.keyPath));
});

test('ChangeRequest _setBaseParcel() and data should use Reducer', () => {
    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let {value} = new ChangeRequest(action)
        ._setBaseParcel(parcel)
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
        payload: {
            value: 3
        }
    });

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        }
    });

    let {value} = new ChangeRequest(action)
        ._setBaseParcel(parcel)
        .prevData;

    var expectedValue = {
        a: 1,
        b: 2
    };

    expect(expectedValue).toEqual(value);
});

test('ChangeRequest data should get latest parcel data from treeshare when called to prevent basing onto stale data', () => {
    expect.assertions(1);

    var action = new Action({
        type: "set",
        keyPath: ["b"],
        payload: {
            value: 3
        }
    });

    var ref = {};

    var parcel = new Parcel({
        value: {
            a: 1,
            b: 2
        },
        handleChange: (parcel) => {
            let {value} = ref.changeRequest.nextData;

            var expectedValue = {
                a: 4,
                b: 3
            };

            expect(expectedValue).toEqual(value);
        }
    });

    ref.changeRequest = new ChangeRequest(action)._setBaseParcel(parcel);
    parcel.get('a').onChange(4);
});


test('ChangeRequest should throw error if data is accessed before _setBaseParcel()', () => {
    expect(() => new ChangeRequest().nextData).toThrowError(`ChangeRequest data cannot be accessed before calling changeRequest._setBaseParcel()`);
    expect(() => new ChangeRequest().prevData).toThrowError(`ChangeRequest data cannot be accessed before calling changeRequest._setBaseParcel()`);
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
        .onChange(456);
});

test('ChangeRequest should cache its data after its calculated, so subsequent calls are faster', () => {

    let amount = 1000;

    let actions = range(amount).map((num) => new Action({
        type: "set",
        keyPath: ["a","b","c","d","e"],
        payload: {
            value: num
        }
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

    let changeRequest = new ChangeRequest(actions)._setBaseParcel(parcel);
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
        payload: {
            value: 100
        }
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

    let basedChangeRequest = new ChangeRequest(action)._setBaseParcel(parcel);
    let {next, prev} = basedChangeRequest.getDataIn(['a', 'c', '#a']);

    expect(next.value).toBe(100);
    expect(prev.value).toBe(0);
});

test('ChangeRequest hasValueChanged should indicate if value changed at path', () => {
    var action = new Action({
        type: "set",
        keyPath: ["a", "c", "#a"],
        payload: {
            value: 100
        }
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

    let basedChangeRequest = new ChangeRequest(action)._setBaseParcel(parcel);

    expect(basedChangeRequest.hasValueChanged(['a', 'c', '#a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'c', '#b'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['a', 'c'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'd'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['b'])).toBe(false);
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

    let basedChangeRequest = new ChangeRequest(action)._setBaseParcel(parcel);

    expect(basedChangeRequest.hasValueChanged(['a'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['a', 'b'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged(['b'])).toBe(false);
});

test('ChangeRequest hasValueChanged should indicate if value changed in array, identifying elements by key', () => {
    var action = new Action({
        type: "insertBefore",
        keyPath: ["#b"],
        payload: {
            value: 999
        }
    });

    var parcel = new Parcel({
        value: [0,1,2,3]
    });

    let basedChangeRequest = new ChangeRequest(action)._setBaseParcel(parcel);

    expect(basedChangeRequest.hasValueChanged(['#a'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#b'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#c'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#d'])).toBe(false);
    expect(basedChangeRequest.hasValueChanged(['#e'])).toBe(true);
    expect(basedChangeRequest.hasValueChanged()).toBe(true);
});
