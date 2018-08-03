// @flow
import Parcel from '../Parcel';

test('ElementParcel.insertBeforeSelf() should insert', () => {
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
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get(1)
        .insertBeforeSelf(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get("#b")
        .insertBeforeSelf(4);
});

test('ElementParcel.insertAfterSelf() should insert', () => {
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
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get(1)
        .insertAfterSelf(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get("#b")
        .insertAfterSelf(4);
});

test('ElementParcel.swapWithSelf() should swap', () => {
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
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get(0)
        .swapWithSelf(2);
});

test('ElementParcel.swapNextWithSelf() should swapNext', () => {
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
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get(0)
        .swapNextWithSelf();

    expectedAction = {
        type: "swapNext",
        keyPath: ["#a"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    }).swapNext("#a");
});


test('ElementParcel.swapPrevWithSelf() should swapPrev', () => {
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
            expect(expectedData).toEqual(parcel.data());
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
        }
    })
        .get("#b")
        .swapPrevWithSelf();
});
