// @flow
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';
import pipeWith from 'unmutable/lib/util/pipeWith';

const makeReducer = (action) => pipeWith(
    new ChangeRequest(action),
    ChangeRequestReducer
);

test('ChangeRequestReducer should setMeta with empty keyPath', () => {
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

    expect(makeReducer(action)(data).meta).toEqual(expectedMeta);
});

test('ChangeRequestReducer should setMeta merge', () => {
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

    expect(makeReducer(action)(data).meta).toEqual(expectedMeta);
});

test('ChangeRequestReducer should setMeta with keyPath', () => {
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

    expect(makeReducer(action)(data).child).toEqual(expectedChild);
});

test('ChangeRequestReducer should merge setMeta with keyPath', () => {
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

    expect(makeReducer(action)(data).child).toEqual(expectedChild);
});

