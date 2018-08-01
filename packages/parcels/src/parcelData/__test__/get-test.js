// @flow
import test from 'ava';
import get from '../get';

test('get should work with objects', t => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        meta: {},
        value: {
            b: 1
        },
        key: "a"
    };

    t.deepEqual(expectedParcelData, get('a')(parcelData));
});

test('get should work with objects with hashkey - just to make sure that hashkeys are only converted to properties when used on an indexed parcel', t => {
    let parcelData = {
        value: {
            ["#a"]: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        meta: {},
        value: {
            b: 1
        },
        key: "#a"
    };

    t.deepEqual(expectedParcelData, get('#a')(parcelData));
});


test('get should not clone value', t => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    t.is(parcelData.value.a, get('a')(parcelData).value);
});

test('get should work with arrays that dont have keys yet', t => {
    let parcelData = {
        value: ['abc']
    };

    let expectedParcelData = {
        meta: {},
        value: 'abc',
        key: "#a"
    };

    t.deepEqual(get(0)(parcelData), expectedParcelData);
});

test('get should work with arrays that dont have keys yet with hashkey', t => {
    let parcelData = {
        value: ['abc', 'def']
    };

    let expectedParcelData = {
        meta: {},
        value: 'def',
        key: "#b"
    };

    t.deepEqual(get("#b")(parcelData), expectedParcelData);
});

test('get should work with objects that already have children, and not recreate children, even if incorrect', t => {
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
        meta: {},
        value: {
            b: 1
        },
        key: 'AsdasdsdDS'
    };

    t.deepEqual(expectedParcelData, get('a')(parcelData));
});

test('get should work with non existent keys', t => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        meta: {},
        value: undefined,
        key: "z"
    };

    t.deepEqual(expectedParcelData, get('z')(parcelData));

    let expectedParcelData2 = {
        meta: {},
        value: "!!!",
        key: "z"
    };

    t.deepEqual(expectedParcelData2, get('z', "!!!")(parcelData));
});
