// @flow
import Parcel from '../Parcel';

test('ChildParcel.delete() should delete self', () => {
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

    new Parcel(data).get('a').delete();
});

test('ChildParcel.delete() should delete self when indexed', () => {
    expect.assertions(1);

    var expectedValue = [1,3];

    var data = {
        value: [1,2,3],
        handleChange: (parcel) => {
            let {value} = parcel.data;
            expect(expectedValue).toEqual(value);
        }
    };

    new Parcel(data).get('#b').delete();
});


test('ChildParcel.isFirst() should detect first child parcel', () => {
    let parcel = new Parcel({
        value: [1,2,1,4]
    });

    expect(parcel.get(0).isFirst()).toBe(true);
    expect(parcel.get(1).isFirst()).toBe(false);
    expect(parcel.get(2).isFirst()).toBe(false);
    expect(parcel.get(3).isFirst()).toBe(false);
});

test('ChildParcel.isLast() should detect first child parcel', () => {
    let parcel = new Parcel({
        value: [1,2,3,4]
    });

    expect(parcel.get(0).isLast()).toBe(false);
    expect(parcel.get(1).isLast()).toBe(false);
    expect(parcel.get(2).isLast()).toBe(false);
    expect(parcel.get(3).isLast()).toBe(true);
});

test('ChildParcel.isFirst() should not detect first child parcel on empty parent', () => {
    let parcel = new Parcel({
        value: {}
    });

    expect(parcel.get('a').isFirst()).toBe(false);
});

test('ChildParcel.isLast() should not detect first child parcel on empty parent', () => {
    let parcel = new Parcel({
        value: {}
    });

    expect(parcel.get('a').isLast()).toBe(false);
});
