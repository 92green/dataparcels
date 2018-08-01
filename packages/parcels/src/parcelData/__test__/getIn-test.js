// @flow
import test from 'ava';
import getIn from '../getIn';

test('getIn should work with objects', (t: Object) => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    let expectedParcelData = {
        value: 1,
        key: "b",
        meta: {}
    };

    t.deepEqual(expectedParcelData, getIn(['a', 'b'])(parcelData));

    let expectedParcelData2 = {
        value: undefined,
        key: 'z',
        meta: {},
        child: undefined
    };

    t.deepEqual(expectedParcelData2, getIn(['z', 'b'])(parcelData));
});

test('getIn should not clone value', (t: Object) => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    t.is(parcelData.value.a.b, getIn(['a','b'])(parcelData).value);
});
