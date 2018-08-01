// @flow
import Parcel from '../Parcel';
import map from 'unmutable/lib/map';

test('ParentParcel.size() should return size of parcel', () => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    expect(new Parcel(data).size()).toBe(2);
});

test('ParentParcel.has(key) should return a boolean indicating if key exists', () => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    expect(new Parcel(data).has('a')).toBe(true);
    expect(new Parcel(data).has('z')).toBe(false);
});


test('ParentParcel.get(key) should return a new child Parcel', () => {
    expect.assertions(4);

    var data = {
        value: {
            a: 1,
            b: 4
        },
        handleChange: (parcel, changeRequest) => {
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
            expect(expectedValue).toEqual(parcel.value());
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

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value()).toBe(1);
    childParcel.onChange(2);
});

test('ParentParcel.get(key).value() should return the same instance of the nested piece of data', () => {
    var myObject = {a:1,b:2};

    var data = {
        value: {
            a: myObject,
            b: 2
        }
    };

    expect(new Parcel(data).get("a").value()).toBe(myObject);
});

test('ParentParcel.get(key).key() on object should return the key', () => {
    var data = {
        value: {
            a: {
                a:1,
                b:2
            },
            b: 2
        }
    };

    expect(new Parcel(data).get("a").key()).toBe("a");
});

test('ParentParcel.get(index).value() on array should return the first element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get(0).value()).toBe(1);
});

test('ParentParcel.get(key).value() on array should return the first element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get("#a").value()).toBe(1);
});

test('ParentParcel.get(key).key() on array should return the key, not the index', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get(0).key()).toBe("#a");
});

test('ParentParcel.get(key).get(key) should return a new child Parcel and chain onChanges', () => {
    expect.assertions(4);

    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        },
        handleChange: (parcel, changeRequest) => {
            expect(parcel.value()).toEqual(expectedValue);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
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

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value()).toBe(2);
    childParcel.onChange(6);
});

test('ParentParcel.get(keyDoesntExist) should return a parcel with value of undefined', () => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    expect(typeof new Parcel(data).get("z").value() === "undefined").toBe(true);
});

test('ParentParcel.get(keyDoesntExist, "notset") should return a parcel with value of "notset"', () => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    expect(new Parcel(data).get("z", "notset").value()).toBe("notset");
});

test('ParentParcel.getIn(keyPath) should return a new descendant Parcel', () => {
    expect.assertions(4);

    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        },
        handleChange: (parcel, changeRequest) => {
            expect(parcel.value()).toEqual(expectedValue);
            expect(expectedAction).toEqual(changeRequest.actions()[0].toJS());
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

    expect(descendantParcel instanceof Parcel).toBe(true);
    expect(descendantParcel.value()).toBe(123);
    descendantParcel.onChange(456);
});

test('ParentParcel.getIn(keyPath) should cope with non existent keypaths', () => {
    var data = {
        value: {
            a: {
                c: {
                    d: 123
                }
            },
            b: 4
        }
    };

    var descendantParcel = new Parcel(data).getIn(["x", "y", "z"]);
    expect(descendantParcel.value()).toEqual(undefined);

    var descendantParcel2 = new Parcel(data).getIn(["x", "y", "z"], "!!!");
    expect(descendantParcel2.value()).toEqual("!!!");
});

test('ParentParcel.toObject() should make an object', () => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    };

    var expectedObject = {a:1,b:2,c:3};
    var parcel = new Parcel(data);
    var obj = map(ii => ii.value())(parcel.toObject());

    expect(expectedObject).toEqual(obj);

});

test('ParentParcel.toObject() should make an object with a mapper', () => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
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

    expect(expectedObject).toEqual(obj);
    expect(passedArgs).toEqual(passedArgs);

});

test('ParentParcel.toArray() should make an array', () => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
    };

    var expectedArray = [1,2,3];
    var parcel = new Parcel(data);
    var array = map(ii => ii.value())(parcel.toArray());

    expect(expectedArray).toEqual(array);

});


test('ParentParcel.toArray() should make an array with a mapper', () => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
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

    expect(expectedArray).toEqual(array);
    expect(passedArgs).toEqual(passedArgs);

});

test('ParentParcel.setSelf() should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect("???").toEqual(value);
        }
    };

    new Parcel(data).setSelf("???");
});

test('ParentParcel.updateSelf() should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect("???").toEqual(value);
        }
    };

    var expectedArg = {
        a: "!!!"
    };

    new Parcel(data).updateSelf((ii) => {
        expect(expectedArg).toEqual(ii);
        return "???";
    });
});

test('ParentParcel.set(key) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(1);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect({a: "???"}).toEqual(value);
        }
    };

    new Parcel(data).set("a", "???");
});

test('ParentParcel.update(key) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(2);

    var data = {
        value: {
            a: "!!!"
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect({a: "???"}).toEqual(value);
        }
    };

    new Parcel(data).update("a", ii => {
        expect("!!!").toBe(ii);
        return "???";
    });
});

test('ParentParcel.setIn(keyPath) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(1);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect({a: {b: "???"}}).toEqual(value);
        }
    };

    new Parcel(data).setIn(["a", "b"], "???");
});

test('ParentParcel.updateIn(keyPath) should call the Parcels handleChange function with the new parcelData', () => {
    expect.assertions(2);

    var data = {
        value: {
            a: {
                b: "!!!"
            }
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            expect({a: {b: "???"}}).toEqual(value);
        }
    };

    new Parcel(data).updateIn(["a", "b"], ii => {
        expect("!!!").toBe(ii);
        return "???";
    });
});
