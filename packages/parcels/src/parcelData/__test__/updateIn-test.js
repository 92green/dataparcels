// @flow
import test from 'ava';
import updateIn from '../updateIn';

const addThree = (parcelData) => ({
    ...parcelData,
    value: parcelData.value + 3
});

test('updateIn should work', t => {
    let parcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a"},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {a:1,b:2,c:3,d:4},
        child: {
            a: {key:"a"},
            b: {key:"b"},
            c: {key:"c"},
            d: {key:"d"}
        },
        meta: {}
    };

    t.deepEqual(expectedParcelData, updateIn(['d'], () => ({value: 4}))(parcelData));
});

test('updateIn should work with existing child', t => {
    let parcelData = {
        value: {a:1,b:2,c:3},
        child: {
            a: {key:"a", child: {z:1}},
            b: {key:"b"},
            c: {key:"c"}
        }
    };

    let expectedParcelData = {
        value: {a:4,b:2,c:3},
        child: {
            a: {key:"a", child: {z:1}, meta:{}},
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    t.deepEqual(expectedParcelData, updateIn(['a'], addThree)(parcelData));
});

test('updateIn should work deeply', t => {
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
                },
                meta: {}
            },
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    t.deepEqual(expectedParcelData, updateIn(['a', 'd'], () => ({value: 4}))(parcelData));
});

test('updateIn should work deeply with existing child', t => {
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
                        key: "d",
                        meta: {}
                    }
                },
                meta: {}
            },
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    t.deepEqual(expectedParcelData, updateIn(['a', 'd'], addThree)(parcelData));
});
