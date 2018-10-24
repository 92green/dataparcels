// @flow
import Reducer from '../Reducer';
import Action from '../Action';
import DeletedParcelMarker from '../../parcelData/DeletedParcelMarker';

test('Reducer should delete key', () => {
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

    expect(Reducer(data, action).value).toEqual(expectedValue);
});

test('Reducer should delete deep key', () => {
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

    expect(Reducer(data, action).value).toEqual(expectedValue);
});

test('Reducer should set value to DeletedParcelMarker symbol if deleted with no keypath', () => {
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
        value: DeletedParcelMarker
    };

    expect(Reducer(data, action)).toEqual(expectedData);
});
