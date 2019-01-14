// @flow
import StaticParcel from '../StaticParcel';
import TestValidateValueUpdater from '../../util/__test__/TestValidateValueUpdater-testUtil';

test('StaticParcels set(key) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        },
        child: {
            a: {key: "a"},
            b: {key: "b"}
        }
    });

    let expectedData = {
        value: {
            a: 456,
            b: 4
        },
        child: {
            a: {
                child: undefined,
                key: "a"
            },
            b: {
                key: "b"
            }
        }
    };

    expect(staticParcel.set('a', 456).data).toEqual(expectedData);
});

test('StaticParcels setIn(keyPath) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: {
                b: 123
            },
            c: 456
        }
    });

    let expectedData = {
        value: {
            a: {
                b: 456
            },
            c: 456
        },
        child: {
            a: {
                child: {
                    b: {
                        child: undefined,
                        key: "b"
                    }
                },
                key: "a"
            },
            c: {
                key: "c"
            }
        }
    };

    expect(staticParcel.setIn(['a', 'b'], 456).data).toEqual(expectedData);
});

test('StaticParcels delete(key) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        },
        child: {
            a: {key: "a"},
            b: {key: "b"}
        }
    });

    let expectedData = {
        value: {
            b: 4
        },
        child: {
            b: {
                key: "b"
            }
        }
    };

    expect(staticParcel.delete('a').data).toEqual(expectedData);
});

test('StaticParcels deleteIn(keyPath) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: {
                b: 123
            },
            c: 456
        }
    });

    let expectedData = {
        value: {
            a: {},
            c: 456
        },
        child: {
            a: {
                child: {},
                key: "a"
            },
            c: {
                key: "c"
            }
        }
    };

    expect(staticParcel.deleteIn(['a', 'b']).data).toEqual(expectedData);
});

test('StaticParcels update(key) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: 1,
            b: 4
        }
    });

    let expectedData = {
        value: {
            a: 2,
            b: 4
        },
        child: {
            a: {
                child: undefined,
                key: "a"
            },
            b: {
                child: undefined,
                key: "b"
            }
        }
    };

    expect(staticParcel.update('a', ii => ii + 1).data).toEqual(expectedData);
});

test('StaticParcels update(key) should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new StaticParcel({
            abc: value
        }).update('abc', updater)
    );
});

test('StaticParcels updateIn(keyPath) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            a: {
                b: 123
            }
        }
    });

    let expectedData = {
        value: {
            a: {
                b: 124
            }
        },
        child: {
            a: {
                child: {
                    b: {
                        child: undefined,
                        key: "b"
                    }
                },
                key: "a"
            }
        }
    };

    expect(staticParcel.updateIn(['a', 'b'], ii => ii + 1).data).toEqual(expectedData);
});

test('StaticParcels updateIn(keyPath) should validate value updater', () => {
    TestValidateValueUpdater(
        expect,
        (value, updater) => new StaticParcel({
            a: {
                b: value
            }
        }).updateIn(['a', 'b'], updater)
    );
});

test('StaticParcels updateShape(key) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            abc: [1,2,3]
        }
    });

    let expectedValue = {
        abc: [1,2,3,4]
    };

    expect(staticParcel.updateShape('abc', staticParcel => staticParcel.push(4)).value).toEqual(expectedValue);
});

test('StaticParcels updateShapeIn(keyPath) should work', () => {
    let staticParcel = StaticParcel.fromData({
        value: {
            abc: {
                def: [1,2,3]
            }
        }
    });

    let expectedValue = {
        abc: {
            def: [1,2,3,4]
        }
    };

    expect(staticParcel.updateShapeIn(['abc', 'def'], staticParcel => staticParcel.push(4)).value).toEqual(expectedValue);
});
