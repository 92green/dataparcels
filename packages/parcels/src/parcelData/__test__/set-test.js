// @flow
import test from 'ava';
import set from '../set';

test('set should work', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, set('d', {value: 4})(parcelData));
});

test('set should work with existing child', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, set('a', {value: 4})(parcelData));
});

test('set should work when setting a child', (tt: Object) => {
    let parcelData = {
        value: {
            a: 1,
            b: 2,
            c: 3
        },
        child: {
            a: {
                key:"a"
            },
            b: {
                key:"b"
            },
            c: {
                key:"c"
            }
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
            b: {
                key:"b"
            },
            c: {
                key:"c"
            }
        },
        meta: {}
    };

    tt.deepEqual(expectedParcelData, set('a', {value: {d:4}, child: {d:{key: 'd'}} })(parcelData));
});

test('set should work with hashKey', (tt: Object) => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    let expectedParcelData = {
        value: [1,4,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ],
        meta: {}
    };

    tt.deepEqual(expectedParcelData, set('#b', {value: 4})(parcelData));
});
