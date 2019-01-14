// @flow
import StaticParcel from '../StaticParcel';

test('StaticParcels should accept value', () => {
    let parcel = new StaticParcel(123);
    expect(parcel.value).toEqual(123);
});

test('StaticParcels.fromData should accept parcel data', () => {
    let data = {
        value: [0,1,2],
        meta: {
            abc: 123
        },
        key: "^",
        child: [
            {key: "#a"},
            {key: "#b"},
            {key: "#c"}
        ]
    };

    let parcel = StaticParcel.fromData(data);
    expect(parcel.data).toEqual(data);
});

test('StaticParcels should return data', () => {
    let parcel = new StaticParcel(123);
    expect(parcel.data).toEqual({
        value: 123
    });
});

test('StaticParcels should return empty meta object', () => {
    let parcel = new StaticParcel(123);
    expect(parcel.meta).toEqual({});
});

test('StaticParcels should throw errors when attempted to set getters', () => {
    let readOnly = 'This property is read-only';

    let parcel = new StaticParcel(123);

    expect(() => {
        parcel.data = 123;
    }).toThrow(readOnly);

    expect(() => {
        parcel.value = 123;
    }).toThrow(readOnly);

    expect(() => {
        parcel.meta = 123;
    }).toThrow(readOnly);

    expect(() => {
        parcel.key = 123;
    }).toThrow(readOnly);

});
