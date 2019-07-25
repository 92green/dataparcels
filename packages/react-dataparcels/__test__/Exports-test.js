// @flow

// dataparcels exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import asRaw from '../asRaw';
import DeletedParcelMarker from '../DeletedParcelMarker';
import ParcelShape from '../ParcelShape';
import asShape from '../asShape';
import cancel from '../cancel';
import validation from '../validation';

// react-dataparcels
import ParcelHoc from '../ParcelHoc';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBoundaryHoc from '../ParcelBoundaryHoc';
import useParcelBuffer from '../useParcelBuffer';
import useParcelForm from '../useParcelForm';
import useParcelSideEffect from '../useParcelSideEffect';
import useParcelState from '../useParcelState';

// internal dataparcels files
import InternalParcel from 'dataparcels';
import InternalAction from 'dataparcels/Action';
import InternalChangeRequest from 'dataparcels/ChangeRequest';
import InternalUpdateRaw from 'dataparcels/asRaw';
import InternalDeletedParcelMarker from 'dataparcels/DeletedParcelMarker';
import InternalParcelShape from 'dataparcels/ParcelShape';
import InternalShape from 'dataparcels/asShape';
import Internalcancel from 'dataparcels/cancel';
import InternalValidation from 'dataparcels/validation';

// internal react-dataparcels
import InternalParcelHoc from '../lib/ParcelHoc';
import InternalParcelBoundary from '../lib/ParcelBoundary';
import InternalParcelBoundaryHoc from '../lib/ParcelBoundaryHoc';
import InternalUseParcelBuffer from '../lib/useParcelBuffer';
import InternalUseParcelForm from '../lib/useParcelForm';
import InternalUseParcelSideEffect from '../lib/useParcelSideEffect';
import InternalUseParcelState from '../lib/useParcelState';

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

test('/DeletedParcelMarker should export DeletedParcelMarker', () => {
    expect(DeletedParcelMarker).toBe(InternalDeletedParcelMarker);
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

test('/ParcelHoc should export ParcelHoc', () => {
    expect(ParcelHoc).toBe(InternalParcelHoc);
});

test('/ParcelBoundary should export ParcelBoundary', () => {
    expect(ParcelBoundary).toBe(InternalParcelBoundary);
});

test('/ParcelBoundaryHoc should export ParcelBoundaryHoc', () => {
    expect(ParcelBoundaryHoc).toBe(InternalParcelBoundaryHoc);
});

test('/useParcelBuffer should export useParcelBuffer', () => {
    expect(useParcelBuffer).toBe(InternalUseParcelBuffer);
});

test('/useParcelForm should export useParcelForm', () => {
    expect(useParcelForm).toBe(InternalUseParcelForm);
});

test('/useParcelSideEffect should export useParcelSideEffect', () => {
    expect(useParcelSideEffect).toBe(InternalUseParcelSideEffect);
});

test('/useParcelState should export useParcelState', () => {
    expect(useParcelState).toBe(InternalUseParcelState);
});
