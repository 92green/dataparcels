// @flow
import test from 'ava';
import get from '../get';

test('get should work with objects', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, get('a')(parcelData));

    let expectedParcelData2 = {
        value: undefined
    };

    tt.deepEqual(expectedParcelData2, get('z')(parcelData));
});

test('get should not clone value', (tt: Object) => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    tt.is(parcelData.value.a, get('a')(parcelData).value);
});

test('get should work with arrays that dont have keys yet', (tt: Object) => {
    let parcelData = {
        value: ['abc']
    };

    let expectedParcelData = {
        value: 'abc',
        key: "#a"
    };

    tt.deepEqual(get(0)(parcelData), expectedParcelData);
});

test('get should work with arrays that dont have keys yet with hashkey', (tt: Object) => {
    let parcelData = {
        value: ['abc', 'def']
    };

    let expectedParcelData = {
        value: 'def',
        key: "#b"
    };

    tt.deepEqual(get("#b")(parcelData), expectedParcelData);
});

test('get should work with objects that already have children, and not recreate children, even if incorrect', (tt: Object) => {
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

    tt.deepEqual(expectedParcelData, get('a')(parcelData));
});
