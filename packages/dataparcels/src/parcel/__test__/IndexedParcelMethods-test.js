// @flow
import Parcel from '../Parcel';

import GetAction from '../../util/__test__/GetAction-testUtil';

test('IndexedParcel.delete() should delete', () => {

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [2,3],
        key: '^',
        child: [
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "delete",
        keyPath: ["#a"],
        payload: {}
    };

    var indexedHandleChange = jest.fn();
    var keyedHandleChange = jest.fn();

    new Parcel({
        ...data,
        handleChange: indexedHandleChange
    }).get(0).delete();

    new Parcel({
        ...data,
        handleChange: keyedHandleChange
    }).get("#a").delete();

    expect(indexedHandleChange.mock.calls[0][0].data).toEqual(expectedData);
    expect(GetAction(indexedHandleChange.mock.calls[0][1])).toEqual(expectedAction);
    expect(keyedHandleChange.mock.calls[0][0].data).toEqual(expectedData);
    expect(GetAction(keyedHandleChange.mock.calls[0][1])).toEqual(expectedAction);

});

test('IndexedParcel.get(hashkey) should return a new child Parcel', () => {
    var data = {
        value: [6,7,8],
        handleChange: () => {}
    };

    var expectedValue = 6;

    var expectedAction = {
        type: "set",
        keyPath: [0],
        payload: {
            child: undefined,
            value: 2
        }
    };

    var childParcel = new Parcel(data).get("#a");

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value).toBe(expectedValue);
});

test('IndexedParcel.move() should move', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [3,1,2],
        key: '^',
        child: [
            {key: "#c"},
            {key: "#a"},
            {key: "#b"}
        ]
    };

    var expectedAction = {
        type: "move",
        keyPath: [2],
        payload: {
            moveKey: 0
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).move(2,0);
});

test('IndexedParcel.push() should push', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [1,2,3,4,5],
        key: '^',
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"},
            {key: "#d"},
            {key: "#e"}
        ]
    };

    var expectedAction = {
        type: "push",
        keyPath: [],
        payload: {
            values: [4,5]
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).push(4,5);
});

test('IndexedParcel.pop() should pop', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [1,2],
        key: '^',
        child: [
            {key: "#a"},
            {key: "#b"}
        ]
    };

    var expectedAction = {
        type: "pop",
        keyPath: [],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).pop();
});

test('IndexedParcel.shift() should shift', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [2,3],
        key: '^',
        child: [
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "shift",
        keyPath: [],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).shift();
});

test('IndexedParcel.swap() should swap', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [3,2,1],
        key: '^',
        child: [
            {key: "#c"},
            {key: "#b"},
            {key: "#a"}
        ]
    };

    var expectedAction = {
        type: "swap",
        keyPath: [0],
        payload: {
            swapKey: 2
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).swap(0,2);
});

test('IndexedParcel.unshift() should unshift', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [4,5,1,2,3],
        key: '^',
        child: [
            {key: "#d"},
            {key: "#e"},
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "unshift",
        keyPath: [],
        payload: {
            values: [4,5]
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).unshift(4,5);
});
