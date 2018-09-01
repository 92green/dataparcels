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

    // TODO - test originId, originPath and meta
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
        .data;

    var expectedValue = {
        a: 1,
        b: 3
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
            let {value} = ref.changeRequest.data;

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
    expect(() => new ChangeRequest().data).toThrowError(`ChangeRequest.data cannot be accessed before calling _setBaseParcel()`);
});

test('ChangeRequest value() should be a shortcut for data().value', () => {
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

    let value = new ChangeRequest(action)
        ._setBaseParcel(parcel)
        .value;

    var expectedValue = {
        a: 1,
        b: 3
    };

    expect(expectedValue).toEqual(value);
});

test('ChangeRequest .meta should be a shortcut for data().meta', () => {
    var action = new Action({
        type: "setMeta",
        payload: {
            meta: {
                abc: 123
            }
        }
    });

    var parcel = new Parcel();

    let {meta} = new ChangeRequest(action)
        ._setBaseParcel(parcel);

    var expectedMeta = {
        abc: 123
    };

    expect(expectedMeta).toEqual(meta);
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
        //.modifyChangeValue(value => value + 1)
});


test('ChangeRequest should keep originId and originPath even when going through a batch() where another change is fired before the original one', () => {
    expect.assertions(2);

    var data = {
        value: {
            abc: 123,
            def: 456
        },
        handleChange: (parcel: Parcel, changeRequest: ChangeRequest) => {
            expect(['abc']).toEqual(changeRequest.originPath);
            expect('^.~mc.abc').toEqual(changeRequest.originId);
        }
    };

    new Parcel(data)
        .modifyChange((parcel, changeRequest) => {
            parcel.set('def', 789);
            parcel.dispatch(changeRequest);
        })
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
        data = changeRequest.data;
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
        data = changeRequest.data;
    });

    expect(expectedData).toEqual(data);

    expect(ms2).toBeLessThan(ms / 100); // expect amazing performance boosts from having cached
});

test('ChangeRequest data chache should be invalidated after every dispatch', () => {
    expect.assertions(4);

    var parcel = new Parcel({
        value: {
            a: {
                b: 123
            }
        }
    });

    parcel
        .get('a')
        .modifyChange((parcel, changeRequest) => {
            expect(changeRequest.data).toEqual({key: 'a', meta: {}, value: {b: 456}, child: {b:{key: "b"}}});
            expect(changeRequest.data).toEqual({key: 'a', meta: {}, value: {b: 456}, child: {b:{key: "b"}}}); // get cached
            parcel.dispatch(changeRequest);
        })
        .get('b')
        .modifyChange((parcel, changeRequest) => {
            expect(changeRequest.data).toEqual({key: 'b', meta: {}, value: 456});
            expect(changeRequest.data).toEqual({key: 'b', meta: {}, value: 456}); // get cached
            parcel.dispatch(changeRequest);
        })
        .onChange(456);
});
