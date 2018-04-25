// @flow
import test from 'ava';
import BaseParcel from '../BaseParcel';
import Parcel from '../../ParcelFactory';

test('IndexedParcel.delete() should delete', tt => {
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
        value: [2,3],
        child: [
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "delete",
        keyPath: [0],
        payload: {}
    };

    var expectedActionWithKey = {
        type: "delete",
        keyPath: ["#a"],
        payload: {}
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct using index');
        }
    }).delete(0);

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            tt.deepEqual(expectedActionWithKey, action[0].toJS(), 'updated action is correct using key');
        }
    }).delete("#a");

});

test('IndexedParcel.get(hashkey) should return a new child Parcel', tt => {
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

    var childParcel = Parcel(data).get("#a");

    tt.true(childParcel instanceof BaseParcel, 'get(hashkey) returns a child Parcel');
    tt.is(childParcel.value(), expectedValue, 'child parcel has correct value');
});

test('IndexedParcel.insert() should insert', tt => {
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
        child: [
            {key: "#a"},
            {key: "#d"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "insert",
        keyPath: [1],
        payload: {
            value: 4
        }
    };

    var expectedActionWithKey = {
        type: "insert",
        keyPath: ["#b"],
        payload: {
            value: 4
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct using index');
        }
    }).insert(1, 4);

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            tt.deepEqual(expectedActionWithKey, action[0].toJS(), 'updated action is correct using key');
        }
    }).insert("#b", 4);
});

test('IndexedParcel.push() should push', tt => {
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
        value: [1,2,3,4],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"},
            {key: "#d"}
        ]
    };

    var expectedAction = {
        type: "push",
        keyPath: [],
        payload: {
            value: 4
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).push(4);
});

test('IndexedParcel.pop() should pop', tt => {
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
        value: [1,2],
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

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).pop();
});

test('IndexedParcel.shift() should shift', tt => {
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
        value: [2,3],
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

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).shift();
});

test('IndexedParcel.swap() should swap', tt => {
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
            swapIndex: 2
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct with indexes');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct with indexes');
        }
    }).swap(0,2);
});

test('IndexedParcel.swapNext() should swapNext', tt => {
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
        child: [
            {key: "#b"},
            {key: "#a"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "swapNext",
        keyPath: [0],
        payload: {}
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).swapNext(0);

    expectedAction = {
        type: "swapNext",
        keyPath: ["#a"],
        payload: {}
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct with keys');
        }
    }).swapNext("#a");
});


test('IndexedParcel.swapPrev() should swapPrev', tt => {
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
        child: [
            {key: "#b"},
            {key: "#a"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "swapPrev",
        keyPath: [1],
        payload: {}
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).swapPrev(1);

    expectedAction = {
        type: "swapPrev",
        keyPath: ["#b"],
        payload: {}
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct with keys');
        }
    }).swapPrev("#b");
});

test('IndexedParcel.unshift() should unshift', tt => {
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
        value: [4,1,2,3],
        child: [
            {key: "#d"},
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    var expectedAction = {
        type: "unshift",
        keyPath: [],
        payload: {
            value: 4
        }
    };

    Parcel({
        ...data,
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            tt.deepEqual(expectedAction, action[0].toJS(), 'updated action is correct');
        }
    }).unshift(4);
});
