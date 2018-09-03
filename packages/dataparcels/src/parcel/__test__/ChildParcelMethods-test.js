// @flow
import Parcel from '../Parcel';

test('ChildParcel.deleteSelf() should delete self', () => {
    expect.assertions(1);

    var expectedValue = {
        b: 2
    };

    var data = {
        value: {
            a: 1,
            b: 2
        },
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(expectedValue).toEqual(value);
        }
    };

    new Parcel(data).get('a').deleteSelf();
});

test('ChildParcel.deleteSelf() should delete self when indexed', () => {
    expect.assertions(1);

    var expectedValue = [1,3];

    var data = {
        value: [1,2,3],
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(expectedValue).toEqual(value);
        }
    };

    new Parcel(data).get('#b').deleteSelf();
});
