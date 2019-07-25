// @flow

// exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import asRaw from '../asRaw';
import deleted from '../deleted';
import ParcelShape from '../ParcelShape';
import asShape from '../asShape';
import cancel from '../cancel';
import validation from '../validation';

// internal files
import InternalParcel from '../src/parcel/Parcel';

// internal lib files
import InternalAction from '../lib/change/Action';
import InternalChangeRequest from '../lib/change/ChangeRequest';
import InternalUpdateRaw from '../lib/parcelData/asRaw';
import Internaldeleted from '../lib/parcelData/deleted';
import InternalParcelShape from '../lib/parcelShape/ParcelShape';
import InternalShape from '../lib/parcelShape/asShape';
import Internalcancel from '../lib/change/cancel';
import InternalValidation from '../lib/validation/validation';

test('index should export Parcel', () => {
    expect(Parcel).toBe(InternalParcel);
});

test('/Action should export Action', () => {
    expect(Action).toBe(InternalAction);
});

test('/ChangeRequest should export ChangeRequest', () => {
    expect(ChangeRequest).toBe(InternalChangeRequest);
});

test('/asRaw should export asRaw', () => {
    expect(asRaw).toBe(InternalUpdateRaw);
});

test('/deleted should export deleted', () => {
    expect(deleted).toBe(Internaldeleted);
});

test('/ParcelShape should export ParcelShape', () => {
    expect(ParcelShape).toBe(InternalParcelShape);
});

test('/asShape should export asShape', () => {
    expect(asShape).toBe(InternalShape);
});

test('/cancel should export cancel', () => {
    expect(cancel).toBe(Internalcancel);
});

test('/validation should export validation', () => {
    expect(validation).toBe(InternalValidation);
});
