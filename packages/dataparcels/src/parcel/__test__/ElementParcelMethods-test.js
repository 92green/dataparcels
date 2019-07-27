// @flow
import Parcel from '../Parcel';

import GetAction from '../../util/__test__/GetAction-testUtil';

test('ElementParcel.insertBefore() should insert', () => {
    expect.assertions(4);

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
        value: [1,4,2,3],
        key: '^',
        child: [
            {key: "#a"},
            {key: "#d"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "insertBefore",
        keyPath: ["#b"],
        payload: {
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
        .get("#b")
        .insertBefore(4);
});

test('ElementParcel.insertAfter() should insert', () => {
    expect.assertions(4);

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
        value: [1,2,4,3],
        key: '^',
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#d"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "insertAfter",
        keyPath: ["#b"],
        payload: {
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
        .get("#b")
        .insertAfter(4);
});

test('ElementParcel.swap() should swap', () => {
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
        keyPath: ["#a"],
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
    })
        .get(0)
        .swap(2);
});

test('ElementParcel.swapNext() should swapNext', () => {
    expect.assertions(4);

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
        value: [2,1,3],
        key: '^',
        child: [
            {key: "#b"},
            {key: "#a"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "swapNext",
        keyPath: ["#a"],
        payload: {}
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

    expectedAction = {
        type: "swapNext",
        keyPath: ["#a"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    }).swapNext("#a");
});


test('ElementParcel.swapPrev() should swapPrev', () => {
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
        value: [2,1,3],
        key: '^',
        child: [
            {key: "#b"},
            {key: "#a"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "swapPrev",
        keyPath: ["#b"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    })
        .get("#b")
        .swapPrev();
});
