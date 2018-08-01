// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('IndexedParcel.delete() should delete', t => {
    t.plan(4);

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
        keyPath: [0],
        payload: {}
    };

    var expectedActionWithKey = {
        type: "delete",
        keyPath: ["#a"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using index');
        }
    }).delete(0);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            t.deepEqual(expectedActionWithKey, changeRequest.actions()[0].toJS(), 'updated action is correct using key');
        }
    }).delete("#a");

});

test('IndexedParcel.get(hashkey) should return a new child Parcel', t => {
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

    t.true(childParcel instanceof Parcel, 'get(hashkey) returns a child Parcel');
    t.is(childParcel.value(), expectedValue, 'child parcel has correct value');
});

test('IndexedParcel.insertBefore() should insertBefore', t => {
    t.plan(4);

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
        keyPath: [1],
        payload: {
            value: 4
        }
    };

    var expectedActionWithKey = {
        type: "insertBefore",
        keyPath: ["#b"],
        payload: {
            value: 4
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using index');
        }
    }).insertBefore(1, 4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            t.deepEqual(expectedActionWithKey, changeRequest.actions()[0].toJS(), 'updated action is correct using key');
        }
    }).insertBefore("#b", 4);
});

test('IndexedParcel.insertAfter() should insertAfter', t => {
    t.plan(4);

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
        keyPath: [1],
        payload: {
            value: 4
        }
    };

    var expectedActionWithKey = {
        type: "insertAfter",
        keyPath: ["#b"],
        payload: {
            value: 4
        }
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using index');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct using index');
        }
    }).insertAfter(1, 4);

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct using key');
            t.deepEqual(expectedActionWithKey, changeRequest.actions()[0].toJS(), 'updated action is correct using key');
        }
    }).insertAfter("#b", 4);
});

test('IndexedParcel.push() should push', t => {
    t.plan(2);

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
        value: [1,2,3,4],
        key: '^',
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

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).push(4);
});

test('IndexedParcel.pop() should pop', t => {
    t.plan(2);

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
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).pop();
});

test('IndexedParcel.shift() should shift', t => {
    t.plan(2);

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
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).shift();
});

test('IndexedParcel.swap() should swap', t => {
    t.plan(2);

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
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct with indexes');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct with indexes');
        }
    }).swap(0,2);
});

test('IndexedParcel.swapNext() should swapNext', t => {
    t.plan(4);

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
        keyPath: [0],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).swapNext(0);

    expectedAction = {
        type: "swapNext",
        keyPath: ["#a"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct with keys');
        }
    }).swapNext("#a");
});


test('IndexedParcel.swapPrev() should swapPrev', t => {
    t.plan(4);

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
        keyPath: [1],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).swapPrev(1);

    expectedAction = {
        type: "swapPrev",
        keyPath: ["#b"],
        payload: {}
    };

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct with keys');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct with keys');
        }
    }).swapPrev("#b");
});

test('IndexedParcel.unshift() should unshift', t => {
    t.plan(2);

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
        value: [4,1,2,3],
        key: '^',
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

    new Parcel({
        ...data,
        handleChange: (parcel, changeRequest) => {
            t.deepEqual(expectedData, parcel.data(), 'updated data is correct');
            t.deepEqual(expectedAction, changeRequest.actions()[0].toJS(), 'updated action is correct');
        }
    }).unshift(4);
});
