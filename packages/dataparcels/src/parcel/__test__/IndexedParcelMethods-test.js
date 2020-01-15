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
        payload: undefined
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

    var childParcel = new Parcel(data).get("#a");

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value).toBe(expectedValue);
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
        payload: [4,5]
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
        type: "delete",
        keyPath: ["#c"],
        payload: undefined
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).pop();
});

test('IndexedParcel.pop() should do nothing if there are no items', () => {
    expect.assertions(1);

    var data = {
        value: [],
        child: []
    };

    var expectedData = {
        meta: {},
        value: [],
        key: '^',
        child: []
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
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
        type: "delete",
        keyPath: ["#a"],
        payload: undefined
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).shift();
});

test('IndexedParcel.shift() should do nothing if there are no items', () => {
    expect.assertions(1);

    var data = {
        value: [],
        child: []
    };

    var expectedData = {
        meta: {},
        value: [],
        key: '^',
        child: []
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
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
        keyPath: ['#a'],
        payload: '#c'
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
        payload: [4,5]
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).unshift(4,5);
});
