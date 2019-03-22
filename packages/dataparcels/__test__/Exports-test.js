// @flow

// exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import DeletedParcelMarker from '../DeletedParcelMarker';
import ParcelShape from '../ParcelShape';
import shape from '../shape';
import CancelActionMarker from '../CancelActionMarker';
import Validation from '../Validation';

// internal files
import InternalParcel from '../src/parcel/Parcel';

// internal lib files
import InternalAction from '../lib/change/Action';
import InternalChangeRequest from '../lib/change/ChangeRequest';
import InternalDeletedParcelMarker from '../lib/parcelData/DeletedParcelMarker';
import InternalParcelShape from '../lib/parcelShape/ParcelShape';
import InternalShape from '../lib/parcelShape/shape';
import InternalCancelActionMarker from '../lib/change/CancelActionMarker';
import InternalValidation from '../lib/validation/Validation';

test('index should export Parcel', () => {
    expect(Parcel).toBe(InternalParcel);
});

test('/Action should export Action', () => {
    expect(Action).toBe(InternalAction);
});

test('/ChangeRequest should export ChangeRequest', () => {
    expect(ChangeRequest).toBe(InternalChangeRequest);
});

test('/DeletedParcelMarker should export DeletedParcelMarker', () => {
    expect(DeletedParcelMarker).toBe(InternalDeletedParcelMarker);
});

test('/ParcelShape should export ParcelShape', () => {
    expect(ParcelShape).toBe(InternalParcelShape);
});

test('/shape should export shape', () => {
    expect(shape).toBe(InternalShape);
});

test('/CancelActionMarker should export CancelActionMarker', () => {
    expect(CancelActionMarker).toBe(InternalCancelActionMarker);
});

test('/Validation should export Validation', () => {
    expect(Validation).toBe(InternalValidation);
});
