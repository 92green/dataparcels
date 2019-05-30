// @flow
import Parcel from 'dataparcels';
import ParcelBufferControl from '../ParcelBufferControl';

export default jest.fn(() => [new Parcel(), new ParcelBufferControl({})]);
