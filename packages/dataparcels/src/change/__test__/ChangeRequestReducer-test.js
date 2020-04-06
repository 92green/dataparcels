// @flow
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';

import push from 'unmutable/lib/push';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

const ActionCreators = {
    deleteSelf: (): Action => {
        return new Action({
            type: "delete"
        });
    },
    insertAfterSelf: (value: any): Action => {
        return new Action({
            type: "insertAfter",
            payload: value
        });
    },
    insertBeforeSelf: (value: any): Action => {
        return new Action({
            type: "insertBefore",
            payload: value
        });
    },
    push: (...values): Action => {
        return new Action({
            type: "push",
            payload: values
        });
    },
    setData: (parcelData): Action => {
        return new Action({
            type: "setData",
            payload: parcelData
        });
    },
    setMeta: (meta): Action => {
        return new Action({
            type: "setMeta",
            payload: meta
        });
    },
    setSelf: (value): Action => {
        return new Action({
            type: "set",
            payload: value
        });
    },
    swap: (keyA, keyB): Action => {
        return new Action({
            type: "swap",
            keyPath: [keyA],
            payload: keyB
        });
    },
    swapNextSelf: (): Action => {
        return new Action({
            type: "swapNext"
        });
    },
    swapPrevSelf: (): Action => {
        return new Action({
            type: "swapPrev"
        });
    },
    unshift: (...values): Action => {
        return new Action({
            type: "unshift",
            payload: values
        });
    },
    update: (updater): Action => {
        return new Action({
            type: "update",
            payload: updater
        });
    }
};

test('ChangeRequestReducer should pass through with no actions', () => {
    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    let actions = [];

    expect(ChangeRequestReducer(actions)(data)).toEqual(data);
});

test('ChangeRequestReducer should process a single "set" action', () => {
    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators.setSelf(456)
    ];

    let expectedData = {
        ...data,
        value: 456
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process two "set" actions', () => {
    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators.setSelf(456),
        ActionCreators.setSelf(789)
    ];

    let expectedData = {
        ...data,
        value: 789
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process single "push" action', () => {
    var data = {
        value: ["A"],
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators.push("B")
    ];

    let expectedData = {
        ...data,
        value: ["A","B"],
        child: [{key: '#a'}, {key: '#b'}]
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process single "push" action with pre functions', () => {
    var data = {
        value: ["A"],
        key: "^",
        child: undefined
    };

    let pushValue = (newValue) => update('value', push(newValue))
    let pre1 = jest.fn(pushValue("1"));
    let pre2 = jest.fn(pushValue("2"));

    let actions = [
        ActionCreators
            .push("B")
            ._addStep({
                type: 'md',
                updater: pre1
            })
            ._addStep({
                type: 'md',
                updater: pre2
            })
    ];

    let expectedData = {
        ...data,
        value: ["A","2","1","B"],
        child: [{key: '#a'}, {key: '#b'}, {key: '#c'}, {key: '#d'}]
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process single "push" action with post functions', () => {
    var data = {
        value: ["A"],
        key: "^",
        child: undefined
    };

    let pushValue = (newValue) => update('value', push(newValue))
    let post1 = jest.fn(pushValue("1"));
    let post2 = jest.fn(pushValue("2"));

    let actions = [
        ActionCreators
            .push("B")
            ._addStep({
                type: 'mu',
                updater: post1
            })
            ._addStep({
                type: 'mu',
                updater: post2
            })
    ];

    let expectedData = {
        ...data,
        value: ["A","B","1","2"],
        child: [{key: '#a'}, {key: '#b'}]
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process a single "set" action at a depth of 1', () => {
    var data = {
        value: {abc: 123},
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators
            .setSelf(456)
            ._addStep({
                type: 'get',
                key: 'abc'
            })
    ];

    let expectedData = {
        ...data,
        value: {abc: 456},
        child: {
            abc: {
                child: undefined,
                key: "abc"
            }
        }
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process a single "set" action at a depth of 2', () => {
    var data = {
        value: {
            abc: {
                def: 123
            }
        },
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators
            .setSelf(456)
            ._addStep({
                type: 'get',
                key: 'def'
            })
            ._addStep({
                type: 'get',
                key: 'abc'
            })
    ];

    let expectedData = {
        ...data,
        value: {
            abc: {
                def: 456
            }
        },
        child: {
            abc: {
                child: {
                    def: {
                        child: undefined,
                        key: "def"
                    }
                },
                key: "abc"
            }
        }
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
});

test('ChangeRequestReducer should process aa complicated bunch of pre and post functions', () => {
    var data = {
        value: {abc: 123},
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators
            .setSelf(456)
            ._addStep({
                type: 'mu',
                updater: update('value', value => value + 1) // 456 -> 457
            })
            ._addStep({
                type: 'get',
                key: 'abc'
            })
            ._addStep({
                type: 'mu',
                updater: update('value', value => ({...value, alsoAlso: value.abc})) // {abc: 457, also: 788} -> {abc: 457, also: 788, alsoAlso: 457}
            })
            ._addStep({
                type: 'md',
                updater: update('value', update('also', also => also - 1)) // {abc: 123} -> {abc: 123, also: 788}
            })
            ._addStep({
                type: 'md',
                updater: update('value', value => ({...value, also: 789})) // {abc: 123} -> {abc: 123, also: 789}
            })
            // wierdly, looking at this syntax, the value starts at the bottom and goes up
    ];

    let expectedValue = {
        abc: 457,
        also: 788,
        alsoAlso: 457
    };

    expect(ChangeRequestReducer(actions)(data).value).toEqual(expectedValue);
});

test('ChangeRequestReducer should process pre and post on parentActions like "swapNextSelf"', () => {
    var data = {
        value: "abc.def.ghi",
        key: "^"
    };

    let pre = update('value', value => value.split("."));
    let post = update('value', value => value.join("."));

    let actions = [
        ActionCreators
            .swapNextSelf()
            ._addStep({
                type: 'get',
                key: 0
            })
            ._addStep({
                type: 'md',
                updater: pre
            })
            ._addStep({
                type: 'mu',
                updater: post
            })
    ];

    let expectedData = {
        key: "^",
        value: "def.abc.ghi"
    };

    let {
        child, // throw away child as this is normally dealt with in updaters
        // it is the reducers job to execute actions correctly, not to ensure the integrity of the data
        // or protect against the setting of invalid data shapes
        ...processed
    } = ChangeRequestReducer(actions)(data);

    expect(processed).toEqual(expectedData);
});

test('ChangeRequestReducer should process deep actions that are "parent actions"', () => {
    var data = {
        value: {
            abc: 123,
            def: 456
        },
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators
            .deleteSelf()
            ._addStep({
                type: 'mu',
                updater: update('value', value => value)
            })
            ._addStep({
                type: 'md',
                updater: update('value', value => value)
            })
            ._addStep({
                type: 'get',
                key: 'abc'
            })
    ];

    let expectedValue = {
        def: 456
    };

    expect(ChangeRequestReducer(actions)(data).value).toEqual(expectedValue);
});

test('ChangeRequestReducer should process an "update" action', () => {
    let updater = jest.fn(parcelData => ({
        ...parcelData,
        value: parcelData.value * 2
    }));

    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    let actions = [
        ActionCreators.update(updater)
    ];

    let expectedData = {
        ...data,
        value: 246
    };

    expect(ChangeRequestReducer(actions)(data)).toEqual(expectedData);
    expect(updater).toHaveBeenCalledTimes(1);
    expect(updater.mock.calls[0][0]).toEqual(data);
});

test('ChangeRequestReducer should process a "batch" action', () => {

    var data = {
        value: [],
        key: "^",
        child: undefined
    };

    let actions = [
        new Action({
            type: 'batch',
            payload: [
                ActionCreators.push("A"),
                ActionCreators.push("B"),
                ActionCreators.push("C")
            ]
        })
    ];

    expect(ChangeRequestReducer(actions)(data).value).toEqual(["A","B","C"]);
});
