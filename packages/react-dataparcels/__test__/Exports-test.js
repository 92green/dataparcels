// @flow

// dataparcels exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import combine from '../combine';
import ParcelNode from '../ParcelNode';
import arrange from '../arrange';
import cancel from '../cancel';
import promisify from '../promisify';
import translate from '../translate';

// react-dataparcels
import Boundary from '../Boundary';
import ParcelBoundary from '../ParcelBoundary';
import ParcelDrag from '../ParcelDrag';
import useParcelBuffer from '../useParcelBuffer';
import useParcelForm from '../useParcelForm';
import useParcelState from '../useParcelState';
import useParcel from '../useParcel';
import useBuffer from '../useBuffer';
import asyncChange from '../asyncChange';
import asyncValue from '../asyncValue';

// internal dataparcels files
import InternalParcel from 'dataparcels';
import InternalAction from 'dataparcels/Action';
import InternalChangeRequest from 'dataparcels/ChangeRequest';
import InternalCreateUpdater from 'dataparcels/combine';
import InternalParcelNode from 'dataparcels/ParcelNode';
import InternalAsNodes from 'dataparcels/arrange';
import Internalcancel from 'dataparcels/cancel';
import InternalPromisify from 'dataparcels/promisify';
import InternalTranslate from 'dataparcels/translate';

// internal react-dataparcels
import InternalBoundary from '../lib/Boundary';
import InternalParcelBoundary from '../lib/ParcelBoundary';
import InternalParcelDrag from '../lib/ParcelDrag';
import InternalUseParcelBuffer from '../lib/useParcelBuffer';
import InternalUseParcelForm from '../lib/useParcelForm';
import InternalUseParcelState from '../lib/useParcelState';
import InternalUseParcel from '../lib/useParcel';
import InternalUseBuffer from '../lib/useBuffer';
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

test('/combine should export combine', () => {
    expect(combine).toBe(InternalCreateUpdater);
});

test('/ParcelNode should export ParcelNode', () => {
    expect(ParcelNode).toBe(InternalParcelNode);
});

test('/arrange should export arrange', () => {
    expect(arrange).toBe(InternalAsNodes);
});

test('/cancel should export cancel', () => {
    expect(cancel).toBe(Internalcancel);
});

test('/promisify should export promisify', () => {
    expect(promisify).toBe(InternalPromisify);
});

test('/translate should export translate', () => {
    expect(translate).toBe(InternalTranslate);
});

test('/Boundary should export Boundary', () => {
    expect(Boundary).toBe(InternalBoundary);
});

test('/ParcelBoundary should export ParcelBoundary', () => {
    expect(ParcelBoundary).toBe(InternalParcelBoundary);
});

test('/ParcelDrag should export ParcelDrag', () => {
    expect(ParcelDrag).toBe(InternalParcelDrag);
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

test('/useParcel should export useParcel', () => {
    expect(useParcel).toBe(InternalUseParcel);
});

test('/useBuffer should export useBuffer', () => {
    expect(useBuffer).toBe(InternalUseBuffer);
});

test('/asyncChange should export asyncChange', () => {
    expect(asyncChange).toBe(InternalAsyncChange);
});

test('/asyncValue should export asyncValue', () => {
    expect(asyncValue).toBe(InternalAsyncValue);
});
