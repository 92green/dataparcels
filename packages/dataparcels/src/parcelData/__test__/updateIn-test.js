// @flow
import updateIn from '../updateIn';

const addThree = (parcelData) => ({
    ...parcelData,
    value: parcelData.value + 3
});

test('updateIn should work with empty keypath', () => {
    let parcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a"},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let updated = updateIn([], (existing) => ({...existing, meta: {}}))(parcelData);

    let expectedParcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a"},
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    expect(updated).toEqual(expectedParcelData);
});

test('updateIn should work with keypath of length 1', () => {
    let parcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a", meta: {abc: 123}},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {a:15,b:2,c:3},
        child: {
            a: {key:"a", meta: {abc: 123}},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedExisting = {
        value: 1,
        meta: {abc: 123},
        key: "a"
    };

    let updated = updateIn(['a'], (existing) => {
        expect(existing).toEqual(expectedExisting);
        return {
            ...existing,
            value: existing.value + 14
        };
    })(parcelData);

    expect(updated).toEqual(expectedParcelData);
});

test('updateIn should work with keypath of length 1 with unkeyed arrays', () => {
    let parcelData = {
        value: [1,2,3]
    };

    let expectedParcelData = {
        value: [1,2,6],
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    let expectedExisting = {
        value: 3,
        key: "#c"
    };

    let updated = updateIn(['#c'], (existing) => {
        expect(existing).toEqual(expectedExisting);
        return {
            ...existing,
            value: 6
        };
    })(parcelData);

    expect(updated).toEqual(expectedParcelData);
});

test('updateIn should work deeply', () => {
    let parcelData = {
        value: {
            a: {},
            b: 2,
            c: 3
        },
        child: {
            a: {key:"a"},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {
            a: {
                d: 4
            },
            b: 2,
            c: 3
        },
        child: {
            a: {
                key:"a",
                child: {
                    d: {
                        key: "d"
                    }
                }
            },
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let updated = updateIn(['a', 'd'], (existing) => ({...existing, value: 4}))(parcelData);

    expect(updated).toEqual(expectedParcelData);
});

test('updateIn should work deeply with existing child', () => {
    let parcelData = {
        value: {
            a: {
                d: 1
            },
            b: 2,
            c: 3
        },
        child: {
            a: {
                key:"a",
                child: {
                    d: {
                        key:"d"
                    }
                }
            },
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {
            a: {
                d: 4
            },
            b: 2,
            c: 3
        },
        child: {
            a: {
                key:"a",
                child: {
                    d: {
                        key: "d"
                    }
                }
            },
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    expect(expectedParcelData).toEqual(updateIn(['a', 'd'], addThree)(parcelData));
});

test('updateIn should work deeply on unkeyed arrays', () => {
    let parcelData = {
        value: [1,2,[3,4,5]],
        key: "^"
    };

    let expectedParcelData = {
        value: [1,2,[3,666,5]],
        key: "^",
        child: [
            {
                key: "#a"
            },
            {
                key: "#b"
            },
            {
                key: "#c",
                child: [
                    {
                        key: "#a"
                    },
                    {
                        key: "#b",
                        meta: {
                            abc: 123
                        }
                    },
                    {
                        key: "#c"
                    }
                ]
            }
        ]
    };

    let updated = updateIn(['#c', '#b'], () => ({
        value: 666,
        meta: {
            abc: 123
        }
    }))(parcelData);

    expect(updated).toEqual(expectedParcelData);
});
