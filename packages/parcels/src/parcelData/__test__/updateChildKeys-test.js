// @flow
import test from 'ava';
import updateChildKeys from '../updateChildKeys';

test('updateChildKeys() adds child keys for objects if they dont exist', t => {
    let data = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {},
            b: {}
        }
    };

    let expectedData = {
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
        }
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for objects if child keys all exist', t => {
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
        }
    };

    t.deepEqual(data, updateChildKeys()(data));
});

test('updateChildKeys() adds child keys for arrays if they dont exist', t => {
    let data = {
        value: [1,2,3],
        child: [{}, {}, {}]
    };

    let expectedData = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for arrays if child keys all exist', t => {
    let data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#p"},
            {key: "#e"}
        ]
    };

    t.deepEqual(data, updateChildKeys()(data));
});

test('updateChildKeys() adds missing keys for arrays', t => {
    let data = {
        value: [1,2,3,4],
        child: [
            {key: "#a"},
            {key: "#p"},
            {},
            {key: "#e"}
        ]
    };

    let expectedData = {
        value: [1,2,3,4],
        child: [
            {key: "#a"},
            {key: "#p"},
            {key: "#q"},
            {key: "#e"}
        ]
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() removes unnecessary keys', t => {
    let data = {
        value: [1,2],
        child: [
            {key: "#a"},
            {key: "#p"},
            {key: "#e"}
        ]
    };

    let expectedData = {
        value: [1,2],
        child: [
            {key: "#a"},
            {key: "#p"}
        ]
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on objects', t => {
    let data = {
        value: {a:[1], b:[2]},
        child: {
            a: {key: "a", child: [{key: "#a"}]},
            b: {child: [{key: "#a"}]}
        }
    };

    let expectedData = {
        value: {a:[1], b:[2]},
        child: {
            a: {key: "a", child: [{key: "#a"}]},
            b: {key: "b", child: [{key: "#a"}]}
        }
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on arrays', t => {
    let data = {
        value: [[1],[2]],
        child: [
            {key: "#x", child: [{key: "#a"}]},
            {child: [{key: "#a"}]}
        ]
    };

    let expectedData = {
        value: [[1],[2]],
        child: [
            {key: "#x", child: [{key: "#a"}]},
            {key: "#y", child: [{key: "#a"}]}
        ]
    };

    t.deepEqual(expectedData, updateChildKeys()(data));
});
