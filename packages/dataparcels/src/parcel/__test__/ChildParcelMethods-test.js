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

    new Parcel(data).get('#1').delete();
});


test('ChildParcel.isFirstChild should detect first child parcel', () => {
    let parcel = new Parcel({
        value: [1,2,1,4]
    });

    expect(parcel.get(0).isFirstChild).toBe(true);
    expect(parcel.get(1).isFirstChild).toBe(false);
    expect(parcel.get(2).isFirstChild).toBe(false);
    expect(parcel.get(3).isFirstChild).toBe(false);
});

test('ChildParcel.isLastChild should detect last child parcel', () => {
    let parcel = new Parcel({
        value: [1,2,3,4]
    });

    expect(parcel.get(0).isLastChild).toBe(false);
    expect(parcel.get(1).isLastChild).toBe(false);
    expect(parcel.get(2).isLastChild).toBe(false);
    expect(parcel.get(3).isLastChild).toBe(true);
});

test('ChildParcel.isOnlyChild should detect only child parcel', () => {
    let parcel = new Parcel({
        value: [1,2]
    });

    let parcel2 = new Parcel({
        value: [3]
    });

    expect(parcel.get(0).isOnlyChild).toBe(false);
    expect(parcel.get(1).isOnlyChild).toBe(false);
    expect(parcel2.get(0).isOnlyChild).toBe(true);
});


test('ChildParcel.isFirstChild should not detect first child parcel on empty parent', () => {
    let parcel = new Parcel({
        value: {}
    });

    expect(parcel.get('a').isFirstChild).toBe(undefined);
});

test('ChildParcel.isFirstChild should not detect first child parcel on non child (top level parcel)', () => {
    let parcel = new Parcel({
        value: 123
    });

    expect(parcel.isFirstChild).toBe(undefined);
});

test('ChildParcel.isLastChild should not detect last child parcel on empty parent', () => {
    let parcel = new Parcel({
        value: {}
    });

    expect(parcel.get('a').isLastChild).toBe(undefined);
});

test('ChildParcel.isLastChild should not detect last child parcel on non child (top level parcel)', () => {
    let parcel = new Parcel({
        value: 123
    });

    expect(parcel.isLastChild).toBe(undefined);
});

test('ChildParcel.isOnlyChild should not detect only child parcel on empty parent', () => {
    let parcel = new Parcel({
        value: {}
    });

    expect(parcel.get('a').isOnlyChild).toBe(undefined);
});

test('ChildParcel.isOnlyChild should not detect only child parcel on non child (top level parcel)', () => {
    let parcel = new Parcel({
        value: 123
    });

    expect(parcel.isOnlyChild).toBe(undefined);
});
