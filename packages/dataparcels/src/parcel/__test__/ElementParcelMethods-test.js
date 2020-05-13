// @flow
import Parcel from '../Parcel';

import GetAction from '../../util/__test__/GetAction-testUtil';

test('IndexedParcel.delete() should delete', () => {

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [2,3],
        key: '^',
        child: [
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.child.delete",
        keyPath: ["#0"],
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
    }).get("#0").delete();

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

    var childParcel = new Parcel(data).get("#0");

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value).toBe(expectedValue);
});

test('ElementParcel.insertBefore() should insert', () => {
    expect.assertions(4);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [1,4,2,3],
        key: '^',
        child: [
            {key: "#0"},
            {key: "#3"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.child.insert",
        keyPath: ["#1"],
        payload: {
            offset: 0,
            value: 4
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get(1)
        .insertBefore(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get("#1")
        .insertBefore(4);
});

test('ElementParcel.insertAfter() should insert', () => {
    expect.assertions(4);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [1,2,4,3],
        key: '^',
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#3"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.child.insert",
        keyPath: ["#1"],
        payload: {
            offset: 1,
            value: 4
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get(1)
        .insertAfter(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get("#1")
        .insertAfter(4);
});

test('ElementParcel.swapNext() should swapNext', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [2,1,3],
        key: '^',
        child: [
            {key: "#1"},
            {key: "#0"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.child.swap",
        keyPath: ["#0"],
        payload: {offset: 1}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get(0)
        .swapNext();
});

test('ElementParcel.swapNext() should swapNext and wrap', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [3,2,1],
        key: '^',
        child: [
            {key: "#2"},
            {key: "#1"},
            {key: "#0"}
        ]
    };

    var expectedAction = {
        type: "array.child.swap",
        keyPath: ["#2"],
        payload: {offset: 1}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get(2)
        .swapNext();
});

test('ElementParcel.swapPrev() should swapPrev', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [2,1,3],
        key: '^',
        child: [
            {key: "#1"},
            {key: "#0"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.child.swap",
        keyPath: ["#1"],
        payload: {offset: -1}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get("#1")
        .swapPrev();
});

test('ElementParcel.swapPrev() should swapPrev and wrap', () => {
    expect.assertions(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [3,2,1],
        key: '^',
        child: [
            {key: "#2"},
            {key: "#1"},
            {key: "#0"}
        ]
    };

    var expectedAction = {
        type: "array.child.swap",
        keyPath: ["#0"],
        payload: {offset: -1}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get(0)
        .swapPrev();
});
