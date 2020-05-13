// @flow
import ActionReducer from '../ActionReducer';
import Action from '../Action';

import TypeSet from '../../typeHandlers/TypeSet';
const typeSet = new TypeSet(TypeSet.defaultTypes);

test('ActionReducer should delete key', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "object.child.delete",
        keyPath: ["a"]
    });

    var expectedValue = {
        b: 2
    };

    expect(ActionReducer(typeSet)(action,data).value).toEqual(expectedValue);
});

test('ActionReducer should delete deep key', () => {
    var data = {
        value: {
            a: {
                b: 2,
                d: 4
            },
            c: 3
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "object.child.delete",
        keyPath: ["a", "b"]
    });

    var expectedValue = {
        a: {
            d: 4
        },
        c: 3
    };

    expect(ActionReducer(typeSet)(action,data).value).toEqual(expectedValue);
});

test('ActionReducer should noop if deleting deep key does nothing', () => {
    var data = {
        value: {
            a: {
                b: 2,
                d: 4
            },
            c: 3
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "object.child.delete",
        keyPath: ["x", "y"]
    });

    var expectedValue = {
        a: {
            b: 2,
            d: 4
        },
        c: 3
    };

    expect(ActionReducer(typeSet)(action,data).value).toEqual(expectedValue);
});

test('ActionReducer should noop if deleting array key does nothing', () => {
    var data = {
        value: [1,2,3],
        key: "^",
        child: undefined
    };

    var action = new Action({
        type: "array.child.delete",
        keyPath: ["#z"]
    });

    expect(ActionReducer(typeSet)(action,data).value).toEqual(data.value);
});
