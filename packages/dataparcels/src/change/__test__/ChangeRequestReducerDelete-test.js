// @flow
import ChangeRequest from '../ChangeRequest';
import ActionReducer from '../ActionReducer';
import Action from '../Action';
import deleted from '../../parcelData/deleted';
import pipeWith from 'unmutable/lib/util/pipeWith';

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
        type: "delete",
        keyPath: ["a"]
    });

    var expectedValue = {
        b: 2
    };

    expect(ActionReducer(action)(data).value).toEqual(expectedValue);
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
        type: "delete",
        keyPath: ["a", "b"]
    });

    var expectedValue = {
        a: {
            d: 4
        },
        c: 3
    };

    expect(ActionReducer(action)(data).value).toEqual(expectedValue);
});

test('ActionReducer should set value to deleted symbol if deleted with no keypath', () => {
    var data = {
        value: {
            a: 1,
            b: 2
        },
        key: "^",
        child: undefined
    };
    var action = new Action({
        type: "delete",
        keyPath: []
    });

    var expectedData = {
        value: deleted
    };

    expect(ActionReducer(action)(data)).toEqual(expectedData);
});
