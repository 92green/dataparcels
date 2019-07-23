// @flow

// dataparcels exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import dangerouslyUpdateParcelData from '../dangerouslyUpdateParcelData';
import DeletedParcelMarker from '../DeletedParcelMarker';
import ParcelShape from '../ParcelShape';
import updateShape from '../updateShape';
import CancelActionMarker from '../CancelActionMarker';
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
import InternalDangerouslyUpdateParcelData from 'dataparcels/dangerouslyUpdateParcelData';
import InternalDeletedParcelMarker from 'dataparcels/DeletedParcelMarker';
import InternalParcelShape from 'dataparcels/ParcelShape';
import InternalShape from 'dataparcels/updateShape';
import InternalCancelActionMarker from 'dataparcels/CancelActionMarker';
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

test('/dangerouslyUpdateParcelData should export dangerouslyUpdateParcelData', () => {
    expect(dangerouslyUpdateParcelData).toBe(InternalDangerouslyUpdateParcelData);
});

test('/DeletedParcelMarker should export DeletedParcelMarker', () => {
    expect(DeletedParcelMarker).toBe(InternalDeletedParcelMarker);
});

test('/ParcelShape should export ParcelShape', () => {
    expect(ParcelShape).toBe(InternalParcelShape);
});

test('/updateShape should export updateShape', () => {
    expect(updateShape).toBe(InternalShape);
});

test('/CancelActionMarker should export CancelActionMarker', () => {
    expect(CancelActionMarker).toBe(InternalCancelActionMarker);
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
