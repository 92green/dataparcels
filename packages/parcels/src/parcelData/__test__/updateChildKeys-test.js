// @flow
import updateChildKeys from '../updateChildKeys';

test('updateChildKeys() adds child keys for objects if they dont exist', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for objects if child keys all exist', () => {
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

    expect(data).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() adds child keys for arrays if they dont exist', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() doesnt change anything for arrays if child keys all exist', () => {
    let data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#p"},
            {key: "#e"}
        ]
    };

    expect(data).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() adds missing keys for arrays', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() removes unnecessary keys', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on objects', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});

test('updateChildKeys() retains deep keys on arrays', () => {
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

    expect(expectedData).toEqual(updateChildKeys()(data));
});
