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

test('Parcel should store debugRender in treeshare', () => {
    expect(new Parcel()._treeshare.getDebugRender()).toBe(false);
    expect(new Parcel({debugRender: true})._treeshare.getDebugRender()).toBe(true);
});
