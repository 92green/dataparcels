// @flow
import test from 'ava';
import Parcel from '../Parcel';

test('ChildParcel.deleteSelf() should delete self', t => {
    t.plan(1);

    var expectedValue = {
        b: 2
    };

    var data = {
        value: {
            a: 1,
            b: 2
        },
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual(expectedValue, value);
        }
    };

    new Parcel(data).get('a').deleteSelf();
});

test('ChildParcel.deleteSelf() should delete self when indexed', t => {
    t.plan(1);

    var expectedValue = [1,3];

    var data = {
        value: [1,2,3],
        handleChange: (parcel) => {
            let {value} = parcel.data();
            t.deepEqual(expectedValue, value);
        }
    };

    new Parcel(data).get('#b').deleteSelf();
});
