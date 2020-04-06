// @flow
import ChangeRequest from '../ChangeRequest';
import ChangeRequestReducer from '../ChangeRequestReducer';
import Action from '../Action';
import deleted from '../../parcelData/deleted';
import pipeWith from 'unmutable/lib/util/pipeWith';

test('ChangeRequestReducer should delete key', () => {
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

    expect(ChangeRequestReducer(action)(data).value).toEqual(expectedValue);
});

test('ChangeRequestReducer should delete deep key', () => {
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

    expect(ChangeRequestReducer(action)(data).value).toEqual(expectedValue);
});

test('ChangeRequestReducer should set value to deleted symbol if deleted with no keypath', () => {
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

    expect(ChangeRequestReducer(action)(data)).toEqual(expectedData);
});
