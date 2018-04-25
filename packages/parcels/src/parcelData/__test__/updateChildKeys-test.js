// @flow
import test from 'ava';
import updateChildKeys from '../updateChildKeys';

test('updateChildKeys() adds child keys for objects if they dont exist', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for objects if child keys all exist', tt => {
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

    tt.deepEqual(data, updateChildKeys()(data));
});

test('updateChildKeys() adds child keys for arrays if they dont exist', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for arrays if child keys all exist', tt => {
    let data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#p"},
            {key: "#e"}
        ]
    };

    tt.deepEqual(data, updateChildKeys()(data));
});

test('updateChildKeys() adds missing keys for arrays', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() removes unnecessary keys', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on objects', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on arrays', tt => {
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

    tt.deepEqual(expectedData, updateChildKeys()(data));
});
