// @flow
import Parcel from '../Parcel';
import TestTimeExecution from '../../util/__test__/TestTimeExecution-testUtil';
import GetAction from '../../util/__test__/GetAction-testUtil';

import every from 'unmutable/lib/every';
import map from 'unmutable/lib/map';
import range from 'unmutable/lib/util/range';

test('ParentParcel.size should return size of parcel', () => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    expect(new Parcel(data).size).toBe(2);
});

test('ParentParcel.size should return size of undefined for non parent parcels', () => {
    var data = {
        value: 123
    };

    expect(new Parcel(data).size).toBe(undefined);
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
            expect(expectedAction).toEqual(GetAction(changeRequest));
            expect(expectedValue).toEqual(parcel.value);
        }
    };

    var expectedValue = {
        a: 2,
        b: 4
    };

    var expectedAction = {
        type: "basic.set",
        keyPath: ["a"],
        payload: 2
    };

    var childParcel = new Parcel(data).get("a");

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value).toBe(1);
    childParcel.set(2);
});

test('ParentParcel.get(key).value should return the same instance of the nested piece of data', () => {
    var myObject = {a:1,b:2};

    var data = {
        value: {
            a: myObject,
            b: 2
        }
    };

    expect(new Parcel(data).get("a").value).toBe(myObject);
});

test('ParentParcel.get(key).key on object should return the key', () => {
    var data = {
        value: {
            a: {
                a:1,
                b:2
            },
            b: 2
        }
    };

    expect(new Parcel(data).get("a").key).toBe("a");
});

test('ParentParcel.get(index).value on array should return the first element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get(0).value).toBe(1);
});

test('ParentParcel.get(key).value on array should return the correct element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get("#2").value).toBe(3);
});

test('ParentParcel.get(key).key on array should return the key, not the index', () => {
    var data = {
        value: [1,2,3]
    };

    expect(new Parcel(data).get(0).key).toBe("#0");
});

test('ParentParcel.get(key).get(key) should return a new child Parcel and chain sets', () => {
    expect.assertions(4);

    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        },
        handleChange: (parcel, changeRequest) => {
            expect(parcel.value).toEqual(expectedValue);
            expect(expectedAction).toEqual(GetAction(changeRequest));
        }
    };

    var expectedValue = {
        a: {
            b: 6
        },
        c: 4
    };

    var expectedAction = {
        type: "basic.set",
        keyPath: ["a", "b"],
        payload: 6
    };

    var childParcel = new Parcel(data).get("a").get("b");

    expect(childParcel instanceof Parcel).toBe(true);
    expect(childParcel.value).toBe(2);
    childParcel.set(6);
});

test('ParentParcel.get(keyDoesntExist) should return a parcel with value of undefined', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            a: 2,
            c: 4
        },
        handleChange
    });

    expect(parcel.get("z").value).toBe(undefined);

    parcel.get("z").set('!!!');
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toEqual({
        a: 2,
        c: 4,
        z: '!!!'
    });
});

test('ParentParcel.get(keyDoesntExist, "notset") should return a parcel with value of "notset"', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            a: 2,
            c: 4
        },
        handleChange
    });

    expect(parcel.get("z", "notset").value).toBe("notset");

    parcel.get("z", "notset").set('!!!');
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toEqual({
        a: 2,
        c: 4,
        z: '!!!'
    });
});

test('ParentParcel.get(keyDoesntExist) on array should error', () => {
    let handleChange = jest.fn();

    var data = {
        value: [0],
        handleChange
    };

    expect(() => new Parcel(data).get(1)).toThrow();
});

test('ParentParcel.get() should be memoized per key', () => {
    let parcel = new Parcel({
        value: {a:123, b:456}
    });

    expect(parcel.get('a')).toBe(parcel.get('a'));
    expect(parcel.get('b').value).toBe(456);
});

test('ParentParcel.get() should be memoized per key on array', () => {
    let parcel = new Parcel({
        value: [123,456]
    });

    expect(parcel.get(0)).toBe(parcel.get(0));
    expect(parcel.get(1).value).toBe(456);
});

test('ParentParcel.get() should cache its parcelData.child after its calculated, so subsequent calls are faster', () => {
    let count = 10000;
    let parcel = new Parcel({
        value: range(count),
        handleChange: (parcel) => {
            parcel.get(1);
            expect(parcel.data.child.length).toBe(count);
        }
    });

    let ms = TestTimeExecution(() => {
        parcel.get(1);
    });

    let ms2 = TestTimeExecution(() => {
        parcel.get(1);
    });

    expect(ms / 10).toBeGreaterThan(ms2); // expect amazing performance boosts from having cached

    parcel.get(0).set(123);
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
            expect(parcel.value).toEqual(expectedValue);
            expect(expectedAction).toEqual(GetAction(changeRequest));
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
        type: "basic.set",
        keyPath: ["a", "c", "d"],
        payload: 456
    };

    var descendantParcel = new Parcel(data).getIn(["a", "c", "d"]);

    expect(descendantParcel instanceof Parcel).toBe(true);
    expect(descendantParcel.value).toBe(123);
    descendantParcel.set(456);
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
    expect(descendantParcel.value).toEqual(undefined);

    var descendantParcel2 = new Parcel(data).getIn(["x", "y", "z"], "!!!");
    expect(descendantParcel2.value).toEqual("!!!");
});

test('ParentParcel.children() should get child parcels in original collection', () => {
    let children = new Parcel({
        value: {a:1,b:2,c:3}
    }).children();

    // test if child parcels are made
    expect(every(parcel => parcel instanceof Parcel)(children)).toBe(true);

    // test if child parcel contents are good
    expect(map(parcel => parcel.value)(children)).toEqual({
        a: 1,
        b: 2,
        c: 3
    });
});

test('ParentParcel.children() should get child parcels in original collection with a mapper', () => {
    let mapper = jest.fn(parcel => parcel.value * 10);
    let children = new Parcel({
        value: {a:1,b:2,c:3}
    }).children(mapper);

    // test if child parcel contents are good
    expect(children).toEqual({
        a: 10,
        b: 20,
        c: 30
    });
});

test('ParentParcel.children() should get child parcels in original array', () => {
    let children = new Parcel({
        value: [1,2,3]
    }).children();

    // test if child parcels are made
    expect(every(parcel => parcel instanceof Parcel)(children)).toBe(true);

    // test if child parcel contents are good
    expect(map(parcel => parcel.value)(children)).toEqual([1,2,3]);
});

test('ParentParcel.children() should get child parcels in original array with a mapper', () => {
    let mapper = jest.fn(parcel => parcel.value * 10);
    let children = new Parcel({
        value: [1,2,3]
    }).children(mapper);

    // test if child parcel contents are good
    expect(children).toEqual([10, 20, 30]);
});
