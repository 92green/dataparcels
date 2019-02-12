// @flow
import Parcel from '../Parcel';

test('Parcels should be able to accept no config', () => {
    let parcel = new Parcel();
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(123);
});

test('Parcels should be able to accept just value in config', () => {
    let parcel = new Parcel({
        value: 123
    });
    expect(123).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcels should be able to accept just handleChange in config', () => {
    let parcel = new Parcel({
        handleChange: (parcel) => {
            expect(456).toBe(parcel.value);
        }
    });
    expect(undefined).toEqual(parcel.value);
    parcel.onChange(456);
});

test('Parcel._changeAndReturn() should call action and return Parcel', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    });

    let newParcel = parcel._changeAndReturn((parcel) => {
        parcel.get('abc').onChange(789);
    });

    // expect correct parcel to be returned
    expect(newParcel.value).toEqual({
        abc: 789,
        def: 456
    });

    // expect parcel's handleChange to have not been called
    expect(handleChange).toHaveBeenCalledTimes(0);

    // now if parcel's change methods are called, handleChange should be called as usual
    parcel.get('abc').onChange(100);
    expect(handleChange).toHaveBeenCalledTimes(1);

    // also if new parcel's change methods are called, handleChange should be called as usual
    newParcel.get('abc').onChange(100);
    expect(handleChange).toHaveBeenCalledTimes(2);
});
