// @flow
import Reducer from '../Reducer';
import Action from '../Action';

test('Reducer should setMeta with empty keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedMeta = {
        abc: 123
    };

    expect(Reducer(data, action).meta).toEqual(expectedMeta);
});

test('Reducer should setMeta merge', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        meta: {
            def: 456
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "setMeta",
        keyPath: [],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedMeta = {
        abc: 123,
        def: 456
    };

    expect(Reducer(data, action).meta).toEqual(expectedMeta);
});

test('Reducer should setMeta with keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "setMeta",
        keyPath: ["a"],
        payload: {
            meta: {
                abc: 123
            }
        }
    });
    var expectedChild = {
        a: {
            key: "a",
            meta: {
                abc: 123
            }
        },
        b: {
            key: "b"
        }
    };

    expect(Reducer(data, action).child).toEqual(expectedChild);
});

test('Reducer should merge setMeta with keyPath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        child: {
            a: {
                key: "a",
                meta: {
                    abc: 123
                }
            },
            b: {
                key: "b"
            }
        },
        key: "^"
    };
    var action = new Action({
        type: "setMeta",
        keyPath: ["a"],
        payload: {
            meta: {
                def: 456
            }
        }
    });
    var expectedChild = {
        a: {
            key: "a",
            meta: {
                abc: 123,
                def: 456
            }
        },
        b: {
            key: "b"
        }
    };

    expect(Reducer(data, action).child).toEqual(expectedChild);
});

