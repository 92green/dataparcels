// @flow
import ActionCreators from '../ActionCreators';
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';

import push from 'unmutable/lib/push';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

const makeReducer = (actions) => pipeWith(
    new ChangeRequest(actions),
    ChangeRequestReducer
);

test('ChangeRequestReducer should pass through with no actions', () => {
    var data = {
        value: 123,
        key: "^",
        child: undefined
    };

    let actions = [];

    expect(makeReducer(actions)(data)).toEqual(data);
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

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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
            ._addPre(pre1)
            ._addPre(pre2)
    ];

    let expectedData = {
        ...data,
        value: ["A","2","1","B"],
        child: [{key: '#a'}, {key: '#b'}, {key: '#c'}, {key: '#d'}]
    };

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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
            ._addPost(post1)
            ._addPost(post2)
    ];

    let expectedData = {
        ...data,
        value: ["A","B","1","2"],
        child: [{key: '#a'}, {key: '#b'}]
    };

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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
            ._unget('abc')
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

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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
            ._unget('def')
            ._unget('abc')
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

    expect(makeReducer(actions)(data)).toEqual(expectedData);
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
            ._addPost(update('value', value => value + 1)) // 456 -> 457
            ._unget('abc')
            ._addPost(update('value', value => ({...value, alsoAlso: value.abc}))) // {abc: 457, also: 788} -> {abc: 457, also: 788, alsoAlso: 457}
            ._addPre(update('value', update('also', also => also - 1))) // {abc: 123} -> {abc: 123, also: 788}
            ._addPre(update('value', value => ({...value, also: 789}))) // {abc: 123} -> {abc: 123, also: 789}
            // wierdly, looking at this syntax, the value starts at the bottom and goes up
    ];

    let expectedValue = {
        abc: 457,
        also: 788,
        alsoAlso: 457
    };

    expect(makeReducer(actions)(data).value).toEqual(expectedValue);
});
