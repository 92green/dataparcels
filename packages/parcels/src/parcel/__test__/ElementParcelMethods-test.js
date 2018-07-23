// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('ElementParcel.insertBeforeSelf() should insert', tt => {
    tt.plan(4);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using index');
        }
    })
        .get(1)
        .insertBeforeSelf(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using key');
        }
    })
        .get("#b")
        .insertBeforeSelf(4);
});

test('ElementParcel.insertAfterSelf() should insert', tt => {
    tt.plan(4);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using index');
        }
    })
        .get(1)
        .insertAfterSelf(4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using key');
        }
    })
        .get("#b")
        .insertAfterSelf(4);
});

test('ElementParcel.swapWithSelf() should swap', tt => {
    tt.plan(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    })
        .get(0)
        .swapWithSelf(2);
});

test('ElementParcel.swapNextWithSelf() should swapNext', tt => {
    tt.plan(4);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct with keys');
        }
    }).swapNext("#a");
});


test('ElementParcel.swapPrevWithSelf() should swapPrev', tt => {
    tt.plan(2);

    var data = {
        value: [1,2,3],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedData = {
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
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            tt.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct with keys');
        }
    })
        .get("#b")
        .swapPrevWithSelf();
});
