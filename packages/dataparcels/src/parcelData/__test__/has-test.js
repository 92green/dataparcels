// @flow
import has from '../has';

test('has should work', () => {
    let parcelData = {
        value: {
            a: {
                b: 1
            }
        }
    };

    expect(has('a')(parcelData)).toBe(true);
    expect(has('b')(parcelData)).toBe(false);
});

test('has should work with hashkeys', () => {
    let parcelData = {
        value: [1,2,3]
    };

    expect(has('#a')(parcelData)).toBe(true);
    expect(has('#d')(parcelData)).toBe(false);
});
