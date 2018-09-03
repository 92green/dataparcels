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
        value: 1,
        key: "b",
        meta: {}
    };

    expect(expectedParcelData).toEqual(getIn(['a', 'b'])(parcelData));

    let expectedParcelData2 = {
        value: undefined,
        key: 'z',
        meta: {},
        child: undefined
    };

    expect(expectedParcelData2).toEqual(getIn(['z', 'b'])(parcelData));
});

test('getIn should not clone value', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };
    expect(parcelData.value.a.b).toBe(getIn(['a','b'])(parcelData).value);
});
