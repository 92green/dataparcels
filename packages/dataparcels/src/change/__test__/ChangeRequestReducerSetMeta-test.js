// @flow
import ChangeRequest from '../ChangeRequest';
import ActionReducer from '../ActionReducer';
import Action from '../Action';
import pipeWith from 'unmutable/lib/util/pipeWith';

test('ActionReducer should setMeta with empty keyPath', () => {
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
            abc: 123
        }
    });
    var expectedMeta = {
        abc: 123
    };

    expect(ActionReducer(action)(data).meta).toEqual(expectedMeta);
});

test('ActionReducer should setMeta merge', () => {
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
            abc: 123
        }
    });
    var expectedMeta = {
        abc: 123,
        def: 456
    };

    expect(ActionReducer(action)(data).meta).toEqual(expectedMeta);
});

test('ActionReducer should setMeta with keyPath', () => {
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
            abc: 123
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

    expect(ActionReducer(action)(data).child).toEqual(expectedChild);
});

test('ActionReducer should merge setMeta with keyPath', () => {
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
            def: 456
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

    expect(ActionReducer(action)(data).child).toEqual(expectedChild);
});

