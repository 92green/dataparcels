// @flow
import test from 'ava';
import set from '../set';

test('set should work', t => {
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

    t.deepEqual(expectedParcelData, set('d', {value: 4})(parcelData));
});

test('set should work with existing child', t => {
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

    t.deepEqual(expectedParcelData, set('a', {value: 4})(parcelData));
});

test('set should work when setting a child', t => {
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

    t.deepEqual(expectedParcelData, set('a', {value: {d:4}, child: {d:{key: 'd'}} })(parcelData));
});

test('set should work with hashKey', t => {
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

    t.deepEqual(expectedParcelData, set('#b', {value: 4})(parcelData));
});

test('set should do nothing with non-existent hashKey', t => {
    let parcelData = {
        value: [1,2,3],
        child: [
            {key:"#a"},
            {key:"#b"},
            {key:"#c"}
        ]
    };

    t.deepEqual(parcelData, set('#z', {value: 4})(parcelData));
});
