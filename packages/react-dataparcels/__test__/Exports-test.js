// @flow

// dataparcels exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import asRaw from '../asRaw';
import deleted from '../deleted';
import ParcelShape from '../ParcelShape';
import ParcelNode from '../ParcelNode';
import asShape from '../asShape';
import asNodes from '../asNodes';
import cancel from '../cancel';
import validation from '../validation';

// react-dataparcels
import ParcelHoc from '../ParcelHoc';
import ParcelBoundary from '../ParcelBoundary';
import ParcelBoundaryHoc from '../ParcelBoundaryHoc';
import useParcelBuffer from '../useParcelBuffer';
import useParcelForm from '../useParcelForm';
import useParcelState from '../useParcelState';
import asyncChange from '../asyncChange';
import asyncValue from '../asyncValue';

// internal dataparcels files
import InternalParcel from 'dataparcels';
import InternalAction from 'dataparcels/Action';
import InternalChangeRequest from 'dataparcels/ChangeRequest';
import InternalUpdateRaw from 'dataparcels/asRaw';
import Internaldeleted from 'dataparcels/deleted';
import InternalParcelShape from 'dataparcels/ParcelShape';
import InternalParcelNode from 'dataparcels/ParcelNode';
import InternalShape from 'dataparcels/asShape';
import InternalAsNodes from 'dataparcels/asNodes';
import Internalcancel from 'dataparcels/cancel';
import InternalValidation from 'dataparcels/validation';

// internal react-dataparcels
import InternalParcelHoc from '../lib/deprecated/ParcelHoc';
import InternalParcelBoundary from '../lib/ParcelBoundary';
import InternalParcelBoundaryHoc from '../lib/deprecated/ParcelBoundaryHoc';
import InternalUseParcelBuffer from '../lib/useParcelBuffer';
import InternalUseParcelForm from '../lib/useParcelForm';
import InternalUseParcelState from '../lib/useParcelState';
import InternalAsyncChange from '../lib/asyncChange';
import InternalAsyncValue from '../lib/asyncValue';

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

test('/ParcelNode should export ParcelNode', () => {
    expect(ParcelNode).toBe(InternalParcelNode);
});

test('/asShape should export asShape', () => {
    expect(asShape).toBe(InternalShape);
});

test('/asNodes should export asNodes', () => {
    expect(asNodes).toBe(InternalAsNodes);
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

test('/useParcelState should export useParcelState', () => {
    expect(useParcelState).toBe(InternalUseParcelState);
});

test('/asyncChange should export asyncChange', () => {
    expect(asyncChange).toBe(InternalAsyncChange);
});

test('/asyncValue should export asyncValue', () => {
    expect(asyncValue).toBe(InternalAsyncValue);
});
