// @flow
import test from 'ava';
import Parcel from '../Parcel';
import map from 'unmutable/lib/map';

let handleChange = ii => {};

test('ParentParcel.size() should return size of parcel', tt => {
    var data = {
        value: {
            a: 1,
            b: 4
        },
        handleChange
    };

    tt.is(new Parcel(data).size(), 2);
});


test('ParentParcel.get(key) should return a new child Parcel', tt => {
    tt.plan(4);

    var data = {
        value: {
            a: 1,
            b: 4
        },
        handleChange: (parcel, action) => {
            tt.deepEqual(expectedAction, action[0].toJS(), 'child parcel onChange passes correct action');
            tt.deepEqual(expectedValue, parcel.value(), 'child parcel onChange updates original parcels value correctly');
        }
    };

    var expectedValue = {
        a: 2,
        b: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a"],
        payload: {
            value: 2
        }
    };

    var childParcel = new Parcel(data).get("a");

    tt.true(childParcel instanceof Parcel, 'get(key) returns a child Parcel');
    tt.is(childParcel.value(), 1, 'child parcel has correct value');
    childParcel.onChange(2);
});

test('ParentParcel.get(key).value() should return the same instance of the nested piece of data', tt => {
    var myObject = {a:1,b:2};

    var data = {
        value: {
            a: myObject,
            b: 2
        },
        handleChange
    };

    tt.is(new Parcel(data).get("a").value(), myObject);
});

test('ParentParcel.get(key).get(key) should return a new child Parcel and chain onChanges', tt => {
    tt.plan(4);

    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        },
        handleChange: (parcel, action) => {
            tt.deepEqual(parcel.value(), expectedValue, 'child parcel onChange updates original parcels value correctly');
            tt.deepEqual(expectedAction, action[0].toJS(), 'child parcel onChange passes correct action');
        }
    };

    var expectedValue = {
        a: {
            b: 6
        },
        c: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a", "b"],
        payload: {
            value: 6
        }
    };

    var childParcel = new Parcel(data).get("a").get("b");

    tt.true(childParcel instanceof Parcel, 'get(key).get(key) returns a grandchild Parcel');
    tt.is(childParcel.value(), 2, 'grandchild parcel has correct value');
    childParcel.onChange(6);
});

test('ParentParcel.get(keyDoesntExist) should return undefined', tt => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        },
        handleChange
    };

    tt.true(typeof new Parcel(data).get("z") === "undefined");
});

test('ParentParcel.getIn(keyPath) should return a new descendant Parcel', tt => {
    tt.plan(4);

    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        },
        handleChange: (parcel, action) => {
            tt.deepEqual(parcel.value(), expectedValue, 'descendant parcel onChange updates original parcels value correctly');
            tt.deepEqual(expectedAction, action[0].toJS(), 'descendant parcel onChange passes correct action');
        }
    };

    var expectedValue = {
        a: {
            c: {
                d: 456
            }
        },
        b: 4
    };

    var expectedAction = {
        type: "set",
        keyPath: ["a", "c", "d"],
        payload: {
            value: 456
        }
    };

    var descendantParcel = new Parcel(data).getIn(["a", "c", "d"]);

    tt.true(descendantParcel instanceof Parcel, 'getIn(keyPath) returns a descendant Parcel');
    tt.is(descendantParcel.value(), 123, 'descendant parcel has correct value');
    descendantParcel.onChange(456);
});

test('ParentParcel.getIn(keyPath) should cope with non existent keypaths', tt => {
    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        },
        handleChange
    };

    var descendantParcel = new Parcel(data).getIn(["x", "y", "z"]);
    tt.deepEqual(descendantParcel, undefined);
});

test('ParentParcel.toObject() should make an object', (tt: Object) => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        },
        handleChange
    };

    var expectedObject = {a:1,b:2,c:3};
    var parcel = new Parcel(data);
    var obj = map(ii => ii.value())(parcel.toObject());

    tt.deepEqual(expectedObject, obj, 'value is correct');

});

test('ParentParcel.toObject() should make an object with a mapper', (tt: Object) => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        },
        handleChange
    };

    var expectedObject = {a:2,b:3,c:4};
    var parcel = new Parcel(data);
    var expectedPassedArgs = [
        {value: 1, key: "a", iter: parcel},
        {value: 2, key: "b", iter: parcel},
        {value: 3, key: "c", iter: parcel}
    ];

    var passedArgs = [];

    var obj = parcel.toObject((pp, key, iter) => {
        passedArgs.push({value: pp.value(), key, iter});
        return pp.value() + 1;
    });

    tt.deepEqual(expectedObject, obj, 'value is correct');
    tt.deepEqual(passedArgs, passedArgs, 'passed args is correct');

});

test('ParentParcel.toArray() should make an array', (tt: Object) => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        },
        handleChange
    };

    var expectedArray = [1,2,3];
    var parcel = new Parcel(data);
    var array = map(ii => ii.value())(parcel.toArray());

    tt.deepEqual(expectedArray, array, 'value is correct');

});


test('ParentParcel.toArray() should make an array with a mapper', (tt: Object) => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        },
        handleChange
    };

    var expectedArray = [2,3,4];
    var parcel = new Parcel(data);
    var expectedPassedArgs = [
        {value: 1, key: 0, iter: parcel},
        {value: 2, key: 1, iter: parcel},
        {value: 3, key: 2, iter: parcel}
    ];

    var passedArgs = [];

    var array = parcel.toArray((pp, key, iter) => {
        passedArgs.push({value: pp.value(), key, iter});
        return pp.value() + 1;
    });

    tt.deepEqual(expectedArray, array, 'value is correct');
    tt.deepEqual(passedArgs, passedArgs, 'passed args is correct');

});

test('ParentParcel.setSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual("???", value);
        }
    };

    new Parcel(data).setSelf("???");
});

test('ParentParcel.updateSelf() should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual("???", value);
        }
    };

    var expectedArg = {
        a: "!!!"
    };

    new Parcel(data).updateSelf((ii) => {
        tt.deepEqual(expectedArg, ii, 'updateSelf passes correct argument to updater');
        return "???";
    });
});

test('ParentParcel.set(key) should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual({a: "???"}, value);
        }
    };

    new Parcel(data).set("a", "???");
});

test('ParentParcel.update(key) should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual({a: "???"}, value);
        }
    };

    new Parcel(data).update("a", ii => {
        tt.is("!!!", ii, 'update passes correct value to updater');
        return "???";
    });
});

test('ParentParcel.setIn(keyPath) should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(1);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual({a: {b: "???"}}, value);
        }
    };

    new Parcel(data).setIn(["a", "b"], "???");
});

test('ParentParcel.updateIn(keyPath) should call the Parcels handleChange function with the new parcelData', (tt: Object) => {
    tt.plan(2);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            tt.deepEqual({a: {b: "???"}}, value);
        }
    };

    new Parcel(data).updateIn(["a", "b"], ii => {
        tt.is("!!!", ii, 'update passes correct value to updater');
        return "???";
    });
});
