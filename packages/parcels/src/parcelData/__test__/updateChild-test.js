// @flow
import test from 'ava';
import updateChild from '../updateChild';

test('updateChild() doesnt add child nodes for non-collections', t => {
    let data = {
        value: 123,
        meta: {}
    };

    t.deepEqual(data, updateChild()(data));
});

test('updateChild() removes child nodes from non-collections', t => {
    let data = {
        value: 123,
        child: {}
    };

    let expectedData = {
        value: 123,
        meta: {}
    };

    t.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() adds child nodes for objects if they dont exist', t => {
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

    t.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() keeps child nodes for objects if they exist', t => {
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

    t.deepEqual(data, updateChild()(data));
});

test('updateChild() updates child nodes for objects if they are wrong', t => {
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

    t.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() adds child nodes for arrays if they dont exist', t => {
    let data = {
        value: [1,2,3]
    };

    let expectedData = {
        value: [1,2,3],
        child: [{}, {}, {}],
        meta: {}
    };

    t.deepEqual(expectedData, updateChild()(data));
});

test('updateChild() keeps child nodes for arrays if they exist', t => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {}
    };

    t.deepEqual(data, updateChild()(data));
});

test('updateChild() passes through meta if it exists', t => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {
            a: 123
        }
    };

    t.deepEqual(data, updateChild()(data));
});
