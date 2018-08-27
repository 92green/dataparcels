// @flow
import Parcel from '../../parcel/Parcel';
import ParcelNode from '../ParcelNode';
import map from 'unmutable/lib/map';

let MakeParcelNode = (data) => new Parcel(data).toParcelNode();

test('ParentParcelNode.size() should return size of parcel', () => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    expect(MakeParcelNode(data).size()).toBe(2);
});

test('ParentParcelNode.has(key) should return a boolean indicating if key exists', () => {
    var data = {
        value: {
            a: 1,
            b: 4
        }
    };

    expect(MakeParcelNode(data).has('a')).toBe(true);
    expect(MakeParcelNode(data).has('z')).toBe(false);
});


test('ParentParcelNode.get(key) should return a new child ParcelNode', () => {
    var data = {
        value: {
            a: 1,
            b: 4
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

    var childParcelNode = MakeParcelNode(data).get("a");

    expect(childParcelNode instanceof ParcelNode).toBe(true);
    expect(childParcelNode.value).toBe(1);
});

test('ParentParcelNode.get(key).value should return the same instance of the nested piece of data', () => {
    var myObject = {a:1,b:2};

    var data = {
        value: {
            a: myObject,
            b: 2
        }
    };

    expect(MakeParcelNode(data).get("a").value).toBe(myObject);
});

test('ParentParcelNode.get(key).key on object should return the key', () => {
    var data = {
        value: {
            a: {
                a:1,
                b:2
            },
            b: 2
        }
    };

    expect(MakeParcelNode(data).get("a").key).toBe("a");
});

test('ParentParcelNode.get(index).value on array should return the first element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(MakeParcelNode(data).get(0).value).toBe(1);
});

test('ParentParcelNode.get(key).value on array should return the first element', () => {
    var data = {
        value: [1,2,3]
    };

    expect(MakeParcelNode(data).get("#a").value).toBe(1);
});

test('ParentParcelNode.get(key).key on array should return the key, not the index', () => {
    var data = {
        value: [1,2,3]
    };

    expect(MakeParcelNode(data).get(0).key).toBe("#a");
});

test('ParentParcelNode.get(key).get(key) should return a new child Parcel', () => {

    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
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

    var childParcelNode = MakeParcelNode(data).get("a").get("b");

    expect(childParcelNode instanceof ParcelNode).toBe(true);
    expect(childParcelNode.value).toBe(2);
});

test('ParentParcelNode.get(keyDoesntExist) should return a parcel with value of undefined', () => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    expect(typeof MakeParcelNode(data).get("z").value === "undefined").toBe(true);
});

test('ParentParcelNode.get(keyDoesntExist, "notset") should return a parcel with value of "notset"', () => {
    var data = {
        value: {
            a: {
                b: 2
            },
            c: 4
        }
    };

    expect(MakeParcelNode(data).get("z", "notset").value).toBe("notset");
});

test('ParentParcelNode.getIn(keyPath) should return a new descendant ParcelNode', () => {
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

    var descendantParcelNode = MakeParcelNode(data).getIn(["a", "c", "d"]);

    expect(descendantParcelNode instanceof ParcelNode).toBe(true);
    expect(descendantParcelNode.value).toBe(123);
});

test('ParentParcelNode.getIn(keyPath) should cope with non existent keypaths', () => {
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

    var descendantParcelNode = MakeParcelNode(data).getIn(["x", "y", "z"]);
    expect(descendantParcelNode.value).toEqual(undefined);

    var descendantParcelNode2 = MakeParcelNode(data).getIn(["x", "y", "z"], "!!!");
    expect(descendantParcelNode2.value).toEqual("!!!");
});

test('ParentParcelNode.toObject() should make an object', () => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    };

    var expectedObject = {a:1,b:2,c:3};
    var parcelNode = MakeParcelNode(data);
    var obj = map(ii => ii.value)(parcelNode.toObject());

    expect(expectedObject).toEqual(obj);

});

test('ParentParcelNode.toObject() should make an object with a mapper', () => {
    var data = {
        value: {a:1,b:2,c:3},
        meta: {
            a: {a:4,b:5,c:6}
        }
    };

    var expectedObject = {a:2,b:3,c:4};
    var parcelNode = MakeParcelNode(data);
    var expectedPassedArgs = [
        {value: 1, key: "a", iter: parcelNode},
        {value: 2, key: "b", iter: parcelNode},
        {value: 3, key: "c", iter: parcelNode}
    ];

    var passedArgs = [];

    var obj = parcelNode.toObject((pp, key, iter) => {
        passedArgs.push({value: pp.value, key, iter});
        return pp.value + 1;
    });

    expect(expectedObject).toEqual(obj);
    expect(passedArgs).toEqual(passedArgs);

});

test('ParentParcelNode.toArray() should make an array', () => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
    };

    var expectedArray = [1,2,3];
    var parcelNode = MakeParcelNode(data);
    var array = map(ii => ii.value)(parcelNode.toArray());

    expect(expectedArray).toEqual(array);

});


test('ParentParcelNode.toArray() should make an array with a mapper', () => {
    var data = {
        value: [1,2,3],
        meta: {
            a: [4,5,6]
        }
    };

    var expectedArray = [2,3,4];
    var parcelNode = MakeParcelNode(data);
    var expectedPassedArgs = [
        {value: 1, key: 0, iter: parcelNode},
        {value: 2, key: 1, iter: parcelNode},
        {value: 3, key: 2, iter: parcelNode}
    ];

    var passedArgs = [];

    var array = parcelNode.toArray((pp, key, iter) => {
        passedArgs.push({value: pp.value, key, iter});
        return pp.value + 1;
    });

    expect(expectedArray).toEqual(array);
    expect(passedArgs).toEqual(passedArgs);

});
