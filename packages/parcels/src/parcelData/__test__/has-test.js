// @flow
import test from 'ava';
import has from '../has';

test('has should work', (t: Object) => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };

    t.true(has('a')(parcelData));
    t.false(has('b')(parcelData));
});

test('has should work with hashkeys', (t: Object) => {
    let parcelData = {
        value: [1,2,3]
    };

    t.true(has('#a')(parcelData));
    t.false(has('#d')(parcelData));
});
