// @flow
import test from 'ava';
import setIn from '../setIn';

test('setIn should work', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, setIn(['d'], {value: 4})(parcelData));
});

test('setIn should work with existing child', (tt: Object) => {
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
            a: {key:"a", child: {z:1}},
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    tt.deepEqual(expectedParcelData, setIn(['a'], {value: 4})(parcelData));
});

test('setIn should work deeply', (tt: Object) => {
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
                meta: {} // TODO this might be wrong - should set() make meta: {} s?
            },
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    tt.deepEqual(expectedParcelData, setIn(['a', 'd'], {value: 4})(parcelData));
});

test('setIn should work deeply with existing child', (tt: Object) => {
    let parcelData = {
        value: {
            a: {
                d: -1
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
                },
                meta: {} // TODO this might be wrong - should set() make meta: {} s?
            },
            b: {key:"b"},
            c: {key:"c"}
        },
        meta: {}
    };

    tt.deepEqual(expectedParcelData, setIn(['a', 'd'], {value: 4})(parcelData));
});
