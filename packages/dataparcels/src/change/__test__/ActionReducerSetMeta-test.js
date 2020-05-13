// @flow
import ActionReducer from '../ActionReducer';
import Action from '../Action';

import TypeSet from '../../typeHandlers/TypeSet';
const typeSet = new TypeSet(TypeSet.defaultTypes);

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
        type: "basic.setMeta",
        keyPath: [],
        payload: {
            abc: 123
        }
    });
    var expectedMeta = {
        abc: 123
    };

    expect(ActionReducer(typeSet)(action,data).meta).toEqual(expectedMeta);
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
        type: "basic.setMeta",
        keyPath: [],
        payload: {
            abc: 123
        }
    });
    var expectedMeta = {
        abc: 123,
        def: 456
    };

    expect(ActionReducer(typeSet)(action,data).meta).toEqual(expectedMeta);
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
        type: "basic.setMeta",
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

    expect(ActionReducer(typeSet)(action,data).child).toEqual(expectedChild);
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
        type: "basic.setMeta",
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

    expect(ActionReducer(typeSet)(action,data).child).toEqual(expectedChild);
});

