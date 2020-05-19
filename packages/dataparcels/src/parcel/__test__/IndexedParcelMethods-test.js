// @flow
import Parcel from '../Parcel';

import GetAction from '../../util/__test__/GetAction-testUtil';

test('IndexedParcel.has() should see if an item exists', () => {

    let p = new Parcel({
        value: [1,2,3]
    });

    expect(p.has(0)).toBe(true);
    expect(p.has(1)).toBe(true);
    expect(p.has(2)).toBe(true);
    expect(p.has(3)).toBe(false);
    expect(p.has(-1)).toBe(true);
    expect(p.has(-2)).toBe(true);
    expect(p.has(-3)).toBe(true);
    expect(p.has(-4)).toBe(false);
    expect(p.has('#0')).toBe(true);
    expect(p.has('#1')).toBe(true);
    expect(p.has('#2')).toBe(true);
    expect(p.has('#3')).toBe(false);
});

test('IndexedParcel.push() should push', () => {
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
        value: [1,2,3,4,5],
        key: '^',
        child: [
            {key: "#0"},
            {key: "#1"},
            {key: "#2"},
            {key: "#3"},
            {key: "#4"}
        ]
    };

    var expectedAction = {
        type: "array.push",
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
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedData = {
        meta: {},
        value: [1,2],
        key: '^',
        child: [
            {key: "#0"},
            {key: "#1"}
        ]
    };

    var expectedAction = {
        type: "array.child.delete",
        keyPath: ["#2"],
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
    let handleChange = jest.fn();

    new Parcel({
        value: [],
        handleChange
    }).pop();

    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('IndexedParcel.shift() should shift', () => {
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

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).shift();
});

test('IndexedParcel.shift() should do nothing if there are no items', () => {
    let handleChange = jest.fn();

    new Parcel({
        value: [],
        handleChange
    }).shift();

    expect(handleChange).toHaveBeenCalledTimes(0);
});

test('IndexedParcel.unshift() should unshift', () => {
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
        value: [4,5,1,2,3],
        key: '^',
        child: [
            {key: "#3"},
            {key: "#4"},
            {key: "#0"},
            {key: "#1"},
            {key: "#2"}
        ]
    };

    var expectedAction = {
        type: "array.unshift",
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
