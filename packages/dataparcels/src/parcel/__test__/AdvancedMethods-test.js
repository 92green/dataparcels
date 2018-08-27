// @flow
import Parcel from '../Parcel';
import ParcelNode from '../../parcelNode/ParcelNode';

test('Parcel should create ParcelNodes with toParcelNode()', () => {
     let parcel = new Parcel({
        value: 123
    });
    expect(parcel.toParcelNode() instanceof ParcelNode).toBe(true);
    expect(parcel.toParcelNode().value).toBe(123);
});

