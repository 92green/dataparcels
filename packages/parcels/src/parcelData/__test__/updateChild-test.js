// @flow
import test from 'ava';
import updateChild from '../updateChild';

test('updateChild() doesnt add child nodes for non-collections', tt => {
    let data = {
        value: 123,
        meta: {}
    };

    tt.deepEqual(data, updateChild()(data));
});

test('updateChild() removes child nodes from non-collections', tt => {
    let data = {
        value: 123,
        child: {}
    };

    let expectedData = {
        value: 123,
        meta: {}
    };

    tt.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() adds child nodes for objects if they dont exist', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        }
    };

    let expectedData = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {},
            b: {}
        },
        meta: {}
    };

    tt.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() keeps child nodes for objects if they exist', tt => {
    let data = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        },
        meta: {}
    };

    tt.deepEqual(data, updateChild()(data));
});

test('updateChild() updates child nodes for objects if they are wrong', tt => {
    let data = {
        value: {
            b: 2,
            c: 3
        },
        child: {
            a: {
                key: "a"
            },
            b: {
                key: "b"
            }
        },
        meta: {}
    };

    let expectedData = {
        value: {
            b: 2,
            c: 3
        },
        child: {
            b: {
                key: "b"
            },
            c: {}
        },
        meta: {}
    };

    tt.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() adds child nodes for arrays if they dont exist', tt => {
    let data = {
        value: [1,2,3]
    };

    let expectedData = {
        value: [1,2,3],
        child: [{}, {}, {}],
        meta: {}
    };

    tt.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() keeps child nodes for arrays if they exist', tt => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {}
    };

    tt.deepEqual(data, updateChild()(data));
});

test('updateChild() passes through meta if it exists', tt => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {
            a: 123
        }
    };

    tt.deepEqual(data, updateChild()(data));
});
