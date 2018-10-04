// @flow
import updateChild from '../updateChild';

test('updateChild() doesnt add child nodes for non-collections', () => {
    let data = {
        value: 123,
        meta: {}
    };

    expect(data).toEqual(updateChild()(data));
});

test('updateChild() removes child nodes from non-collections', () => {
    let data = {
        value: 123,
        child: {}
    };

    let expectedData = {
        value: 123
    };

    expect(expectedData).toEqual(updateChild()(data));
});

test('updateChild() adds child nodes for objects if they dont exist', () => {
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
        }
    };

    expect(expectedData).toEqual(updateChild()(data));
});

test('updateChild() keeps child nodes for objects if they exist', () => {
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

    expect(data).toEqual(updateChild()(data));
});

test('updateChild() updates child nodes for objects if they are wrong', () => {
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

    expect(expectedData).toEqual(updateChild()(data));
});

test('updateChild() adds child nodes for arrays if they dont exist', () => {
    let data = {
        value: [1,2,3]
    };

    let expectedData = {
        value: [1,2,3],
        child: [{}, {}, {}]
    };

    expect(expectedData).toEqual(updateChild()(data));
});

test('updateChild() adds child nodes for arrays if they partially exist', () => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}]
    };

    let expectedData = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}]
    };

    expect(expectedData).toEqual(updateChild()(data));
});

test('updateChild() adds child nodes for arrays if they partially exist', () => {
    let data = {
        value: [1,2,3,undefined,4],
        child: [{key: "#a"},{key: "#b"},{key: "#c"}]
    };

    let expectedData = {
        value: [1,2,3,undefined,4],
        child: [{key: "#a"},{key: "#b"},{key: "#c"},{},{}]
    };

    expect(expectedData).toEqual(updateChild()(data));
});


test('updateChild() keeps child nodes for arrays if they exist', () => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {}
    };

    expect(data).toEqual(updateChild()(data));
});

test('updateChild() passes through meta if it exists', () => {
    let data = {
        value: [1,2,3],
        child: [{key: "#a"}, {}, {}],
        meta: {
            a: 123
        }
    };

    expect(data).toEqual(updateChild()(data));
});
