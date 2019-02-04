// @flow
import getIn from '../getIn';

test('getIn should work with objects', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        value: {
            b: 1
        },
        key: "a"
    };

    expect(expectedParcelData).toEqual(getIn(['a'])(parcelData));
});

test('getIn should work with objects with child data', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        },
        meta: {
            abc: 123
        },
        child: {
            a: {
                key: "a",
                meta: {
                    def: 456
                },
                child: {
                    b: {
                        key: "b",
                        meta: {
                            ghi: 789
                        }
                    }
                }
            }
        }
    };

    let expectedParcelData = {
        value: {
            b: 1
        },
        meta: {
            def: 456
        },
        key: "a",
        child: {
            b: {
                key: "b",
                meta: {
                    ghi: 789
                }
            }
        }
    };

    expect(expectedParcelData).toEqual(getIn(['a'])(parcelData));
});

test('getIn should work with objects with hashkey - just to make sure that hashkeys are only converted to properties when used on an indexed parcel', () => {
    let parcelData = {
        value: {
            ["#a"]: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        value: {
            b: 1
        },
        key: "#a"
    };

    expect(expectedParcelData).toEqual(getIn(['#a'])(parcelData));
});


test('getIn should not clone value', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    expect(parcelData.value.a).toBe(getIn(['a'])(parcelData).value);
});

test('getIn should work with arrays that dont have keys yet', () => {
    let parcelData = {
        value: ['abc']
    };

    let expectedParcelData = {
        value: 'abc',
        key: "#a"
    };

    expect(getIn([0])(parcelData)).toEqual(expectedParcelData);
});

test('getIn should work with arrays that dont have keys yet with hashkey', () => {
    let parcelData = {
        value: ['abc', 'def']
    };

    let expectedParcelData = {
        value: 'def',
        key: "#b"
    };

    expect(getIn(["#b"])(parcelData)).toEqual(expectedParcelData);
});

test('getIn should work with objects that already have children, and not recreate children, even if incorrect', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        },
        child: {
            a: {
                key: 'AsdasdsdDS'
            }
        }
    };
    let expectedParcelData = {
        value: {
            b: 1
        },
        key: 'AsdasdsdDS'
    };

    expect(expectedParcelData).toEqual(getIn(['a'])(parcelData));
});

test('getIn should work with non existent keys', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        value: undefined,
        key: "z"
    };

    expect(expectedParcelData).toEqual(getIn(['z'])(parcelData));

    let expectedParcelData2 = {
        value: "!!!",
        key: "z"
    };

    expect(expectedParcelData2).toEqual(getIn(['z'], "!!!")(parcelData));
});

//
// deep tests
//

test('getIn should work deeply', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        value: 1,
        key: "b"
    };

    expect(getIn(['a', 'b'])(parcelData)).toEqual(expectedParcelData);
});

test('getIn should return undefined if asking through a non-parent', () => {
    let parcelData = {
        value: {
            a: 123
        }
    };
    let expectedParcelData = {
        value: undefined,
        key: "b"
    };

    expect(getIn(['a', 'b'])(parcelData)).toEqual(expectedParcelData);
});

test('getIn should return undefined if asking for a non-existent key', () => {
    let parcelData = {
        value: {
            a: {
                b: 123
            }
        }
    };
    let expectedParcelData = {
        value: undefined,
        key: "c"
    };

    expect(getIn(['a', 'c'])(parcelData)).toEqual(expectedParcelData);
});
