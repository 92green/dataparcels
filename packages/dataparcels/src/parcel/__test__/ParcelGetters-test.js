// @flow
import Parcel from '../Parcel';

test('Parcel.data should return the Parcels data', () => {
    var data = {
        value: 123,
        child: undefined
    };

    var expectedData = {
        value: 123,
        child: undefined,
        key: '^',
        meta: {}
    };

    expect(expectedData).toEqual(new Parcel(data).data);
});

test('Parcel.value should return the Parcels value', () => {
    var data = {
        value: 123
    };
    expect(new Parcel(data).value).toBe(123);
});

test('Parcel.value should return the same instance of the Parcels value', () => {
    var myObject = {a:1,b:2};
    var data = {
        value: myObject
    };
    expect(new Parcel(data).value).toBe(myObject);
});

test('Parcel.meta should return meta', () => {
    var meta = {
        abc: 123,
        def: 456
    };

    var data = {
        value: 123,
        handleChange: (parcel) => {
            // the see if it is returned correctly
            expect(meta).toEqual(parcel.meta);
            expect(meta !== parcel.meta).toBe(true);
        }
    };

    // first set the meta
    var parcel = new Parcel(data).setMeta(meta);
});
