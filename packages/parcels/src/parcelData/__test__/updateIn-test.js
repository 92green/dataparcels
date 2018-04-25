// @flow
import test from 'ava';
import updateIn from '../updateIn';

const addThree = (parcelData) => ({
    ...parcelData,
    value: parcelData.value + 3
});

test('updateIn should work', (tt: Object) => {
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
        }
    };

    tt.deepEqual(expectedParcelData, updateIn(['d'], () => ({value: 4}))(parcelData));
});

test('updateIn should work with existing child', (tt: Object) => {
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
        }
    };

    tt.deepEqual(expectedParcelData, updateIn(['a'], addThree)(parcelData));
});

test('updateIn should work deeply', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, updateIn(['a', 'd'], () => ({value: 4}))(parcelData));
});

test('updateIn should work deeply with existing child', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, updateIn(['a', 'd'], addThree)(parcelData));
});
