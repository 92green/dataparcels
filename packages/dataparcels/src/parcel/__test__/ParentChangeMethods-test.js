// @flow
import Parcel from '../Parcel';
import ParcelShape from '../../parcelShape/ParcelShape';

test('ParentParcel.map() should call each child Parcels handleChange function with the new parcelData', () => {
    let updater = jest.fn(ii => ii + 1);
    let handleChange = jest.fn();

    new Parcel({
        value: {
            abc: 123,
            def: 456
        },
        handleChange
    }).map(updater);

    expect(handleChange.mock.calls[0][0].data.value).toEqual({
        abc: 124,
        def: 457
    });
});

test('ParentParcel.map(parcelShapeUpdater) should call each child Parcels handleChange function with the new parcelData', () => {
    let updater = jest.fn(parcelShape => parcelShape.update('name', name => name + "!"));
    let handleChange = jest.fn();

    new Parcel({
        value: [
            {name: 'foo'},
            {name: 'bar'}
        ],
        handleChange
    }).map(ParcelShape.update(updater));

    expect(handleChange.mock.calls[0][0].data.value).toEqual([
        {name: 'foo!'},
        {name: 'bar!'}
    ]);
});
