// @flow
import test from 'ava';
import has from '../has';

test('has should work', (tt: Object) => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };

    tt.true(has('a')(parcelData));
    tt.false(has('b')(parcelData));
});

test('has should work with hashkeys', (tt: Object) => {
    let parcelData = {
        value: [1,2,3]
    };

    tt.true(has('#a')(parcelData));
    tt.false(has('#d')(parcelData));
});
